from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from config import (
    MONGODB_URI,
    MONGODB_DB,
    MONGODB_TLS,
    MONGODB_CAFILE
)
from schemas.user import User
from schemas.task import Task
from schemas.avatar import Avatar
from schemas.record import Record
from schemas.prize import Prize
from schemas.prize_order import PrizeOrder
from schemas.prize_image import PrizeImage

client = AsyncIOMotorClient(
    MONGODB_URI,
    tls=MONGODB_TLS,
    tlsCAFile=MONGODB_CAFILE
)

DB = client[MONGODB_DB]


async def setup():
    await init_beanie(
        database=DB,
        document_models=[
            User,
            Task,
            Avatar,
            Record,
            Prize,
            PrizeOrder,
            PrizeImage
        ]
    )
