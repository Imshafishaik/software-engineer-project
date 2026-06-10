from utils.database import Base, SessionLocal, engine, get_db

SQLALCHEMY_DATABASE_URL = str(engine.url)
