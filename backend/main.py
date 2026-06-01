from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.database import engine, Base
from routes import auth_routes, vehicle_routes, user_routes

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OnRide Rentals API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(vehicle_routes.router)
app.include_router(user_routes.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to OnRide Rentals API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
