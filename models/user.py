from beanie import Document
from pydantic import Field, BaseModel


class User(Document):
    username: str
    email: str
    password: str

    class Settings:
        name = "users"


class UserResponse(BaseModel):
    id: str
    username: str
    email: str

    class Config:
        from_attributes = True


async def get_user_by_id(user_id: str) -> User | None:
    return await User.get(user_id)


async def get_user_by_email(email: str) -> User | None:
    return await User.find_one(User.email == email)
