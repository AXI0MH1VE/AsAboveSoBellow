from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import stem.control
import socket
import requests
import asyncio
import i2plib
import socks

app = FastAPI(title="Nexus-X API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TOR_CONTROL_PORT = 9051
TOR_SOCKS_PORT = 9050
I2P_SAM_PORT = 7656
I2P_SOCKS_PORT = 4444

@app.get("/status")
async def get_status():
    status = {
        "tor": "offline",
        "i2p": "offline",
        "tor_circuits": 0,
        "i2p_peers": 0
    }
    
    # Check Tor
    try:
        with stem.control.Controller.from_port(port=TOR_CONTROL_PORT) as controller:
            controller.authenticate()  # Assumes no password or cookie authentication
            status["tor"] = "online"
            status["tor_circuits"] = len(controller.get_circuits())
    except Exception:
        pass
        
    # Check I2P SAM
    try:
        # i2plib call to check session or just socket check
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        result = s.connect_ex(('127.0.0.1', I2P_SAM_PORT))
        if result == 0:
            status["i2p"] = "online"
        s.close()
    except Exception:
        pass
        
    return status

@app.post("/tor/rotate")
async def rotate_tor():
    try:
        with stem.control.Controller.from_port(port=TOR_CONTROL_PORT) as controller:
            controller.authenticate()
            controller.signal(stem.Signal.NEWNYM)
            return {"status": "success", "message": "Identity rotation requested"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leak-check")
async def leak_check():
    """Checks the external IP through Tor/I2P and Clearnet."""
    results = {}
    
    # Clearnet IP
    try:
        results["clearnet_ip"] = requests.get("https://api64.ipify.org?format=json").json()["ip"]
    except:
        results["clearnet_ip"] = "failed"
        
    # Tor IP
    try:
        proxies = {
            'http': f'socks5h://127.0.0.1:{TOR_SOCKS_PORT}',
            'https': f'socks5h://127.0.0.1:{TOR_SOCKS_PORT}'
        }
        results["tor_ip"] = requests.get("https://api64.ipify.org?format=json", proxies=proxies).json()["ip"]
    except:
        results["tor_ip"] = "offline"
        
    return results

@app.get("/scan")
async def scan_port(host: str, port: int):
    """SOCKS5-aware port check."""
    try:
        socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", TOR_SOCKS_PORT)
        s = socks.socksocket()
        s.settimeout(5)
        s.connect((host, port))
        s.close()
        return {"host": host, "port": port, "status": "open"}
    except Exception as e:
        return {"host": host, "port": port, "status": "closed", "detail": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
