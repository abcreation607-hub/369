from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import os
import time

app = FastAPI(title="Charan Mobiles API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Security Dependency
def verify_owner(x_owner_token: str = Header(None)):
    if x_owner_token != "charan10":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Owner Passcode")

# Datastores
products_db = []
ebills_db = []

@app.get("/api/products")
def get_products():
    return products_db

@app.post("/api/owner/products")
async def create_product(
    name: str = Form(...),
    condition: str = Form(...),
    actualPrice: float = Form(...),
    offerPrice: float = Form(...),
    desc: str = Form(...),
    image: UploadFile = File(None),
    x_owner_token: str = Header(None)
):
    verify_owner(x_owner_token)
    
    file_url = ""
    if image:
        file_location = f"uploads/{int(time.time())}_{image.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(image.file, file_object)
        file_url = "/" + file_location

    new_prod = {
        "id": f"p_{int(time.time())}",
        "name": name,
        "condition": condition,
        "actualPrice": actualPrice,
        "offerPrice": offerPrice,
        "desc": desc,
        "imageUrl": file_url
    }
    products_db.insert(0, new_prod)
    return {"message": "Success", "product": new_prod}

@app.get("/api/ebill/{search_term}")
def get_ebill(search_term: str):
    for bill in ebills_db:
        if bill["customerPhone"] == search_term or bill["invoiceNumber"].lower() == search_term.lower():
            return bill
    raise HTTPException(status_code=404, detail="Bill not found")

