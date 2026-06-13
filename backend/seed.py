from database import SessionLocal, engine
from models import Base, User, Vehicle
from auth import get_password_hash

Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    if db.query(User).first():
        db.close()
        return

    owner = User(email="owner@test.com", name="Owner", role="owner", hashed_password=get_password_hash("password"))
    rider = User(email="rider@test.com", name="Rider", role="rider", hashed_password=get_password_hash("password"))
    db.add(owner)
    db.add(rider)
    db.commit()
    db.refresh(owner)

    v1 = Vehicle(
        owner_id=owner.id,
        make="Ford",
        model="Transit",
        year=2020,
        price_per_day=120.0,
        accessibility_features="Wheelchair ramp, tie-downs, lowered floor",
        image_url="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
        description="Spacious van with reliable manual ramp."
    )
    v2 = Vehicle(
        owner_id=owner.id,
        make="Toyota",
        model="Sienna",
        year=2021,
        price_per_day=95.0,
        accessibility_features="Side-entry ramp, power sliding doors",
        image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
        description="Comfortable minivan with automated accessibility features."
    )
    db.add(v1)
    db.add(v2)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
    print("Database seeded")