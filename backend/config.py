from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    sqlalchemy_database_url: str = "mysql+pymysql://root@localhost:3306/onride_rentals_se"
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    @property
    def database_url(self) -> str:
        return self.sqlalchemy_database_url

    class Config:
        env_file = ".env"


settings = Settings()
