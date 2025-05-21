from bcrypt import checkpw, gensalt, hashpw
from beanie import Document, Indexed
from pydantic import (
    BaseModel,
    Field,
    field_serializer,
    field_validator,
)

from typing import (
    Annotated,
    Literal,
    Optional,
)

from config import INSTANCE_ID
from snowflake import SnowflakeGenerator, SnowflakeID
from utils.email_checker import check_is_email

uid_generator = SnowflakeGenerator(INSTANCE_ID)

GENDER_TYPE = Literal["male", "female", "other"]
DEPARTMENT_TYPE = Literal[
    "中國文學系",
    "外國語文學系",
    "歷史學系",
    "臺灣文學系",
    "藝術研究所",
    "考古學研究所",
    "戲劇碩士學位學程",
    "數學系",
    "化學系",
    "物理學系",
    "地球科學系",
    "光電科學與工程學系",
    "太空與電漿科學研究所",
    "理論科學研究中心",
    "會計學系暨財務金融研究所",
    "統計學系",
    "企業管理學系",
    "交通管理科學系",
    "電信管理研究所",
    "國際企業研究所",
    "體育健康與休閒研究所",
    "工業與資訊管理學系暨資訊管理研究所",
    "數據科學研究所",
    "高階管理碩士在職專班",
    "國際經營管理研究所",
    "經營管理碩士學位學程",
    "高階經營管理博士學位學程",
    "機械工程學系",
    "化學工程學系",
    "土木工程學系",
    "材料科學及工程學系",
    "水利及海洋工程學系",
    "工程科學系",
    "系統及船舶機電工程學系",
    "航空太空工程學系",
    "資源工程學系",
    "環境工程學系",
    "生物醫學工程學系",
    "測量及空間資訊學系",
    "海洋科技與事務研究所",
    "民航研究所",
    "太空系統工程研究所",
    "能源工程國際學位學程",
    "尖端材料國際碩士學位學程",
    "自然災害減災及管理國際碩士學位學程",
    "工程管理碩士在職專班",
    "醫療器材創新國際碩士班",
    "智慧製造國際碩士學位學程",
    "電機工程學系",
    "資訊工程學系",
    "醫學資訊研究所",
    "微電子工程研究所",
    "製造資訊與系統研究所",
    "電腦與通信工程研究所",
    "奈米積體電路工程碩士學位學程",
    "智慧資訊安全碩士學位學程",
    "政治學系",
    "經濟學系",
    "法律學系",
    "心理學系",
    "教育研究所",
    "建築學系",
    "都市計劃學系",
    "工業設計學系",
    "創意產業設計研究所",
    "科技藝術碩士學位學程",
    "生命科學系",
    "生物科技與產業科學系",
    "熱帶植物與微生物科學研究所",
    "轉譯農業科學博士學位學程",
    "解剖學科暨細胞生物與解剖學研究所",
    "生物化學暨分子生物學研究所",
    "生理學科暨研究所",
    "微生物學科暨微生物及免疫學研究所",
    "藥理學科暨藥理學研究所",
    "公共衛生學科暨公共衛生研究所",
    "工業衛生學科暨環境醫學研究所",
    "藥學系",
    "護理學系",
    "牙醫學系",
    "物理治療學系",
    "職能治療學系",
    "醫學檢驗生物技術學系",
    "臨床藥學與藥物科技研究所",
    "基礎醫學研究所",
    "行為醫學研究所",
    "分子醫學研究所",
    "口腔醫學研究所",
    "臨床醫學研究所",
    "健康照護科學研究所",
    "老年學研究所",
    "食品安全衛生暨風險管理研究所",
    "智慧科技系統碩士學位學程",
    "智慧運算碩士學位學程",
    "智慧運算工程博士學位學程",
    "晶片設計學位學程",
    "半導體製程學位學程",
    "半導體封測學位學程",
    "關鍵材料學位學程",
    "智慧與永續製造學位學程",
    "半導體高階管理暨研發碩士在職專班",
    "全校不分系學士學位學程",
    "全校永續跨域國際碩士學位學程",
]


class User(Document):
    uid: Annotated[SnowflakeID, Indexed(unique=True)] = Field(
        title="UID",
        description="UID of user, use snowflake format.",
        default_factory=uid_generator.next_id,
        examples=["6209533852516352"]
    )
    name: str = Field(
        title="Username",
        description="Username of user.",
        examples=["username"],
        min_length=1
    )
    email: Annotated[str, Indexed(unique=True)] = Field(
        title="Email",
        description="User's email.",
        examples=["user@example.com"],
    )
    phone: str = Field(
        title="Phone number",
        description="User's phone number.",
        examples=["0912345678"],
    )
    gender: GENDER_TYPE = Field(
        title="Gender",
        description="User's gender, true rerepresent female.",
        examples=["other"],
    )
    department: DEPARTMENT_TYPE = Field(
        title="Department",
        description="User's department.",
        examples=["資訊工程學系"],
    )
    department_level: int = Field(
        title="Department Level",
        description="Department level of user.",
        examples=[1],
        ge=1,
        le=10,
    )
    password: bytes = Field(
        title="Password(Hash)",
        description="Password of user after hash.",
        examples=[b"passw0rd"],
        min_length=8,
    )
    score: int = Field(
        default=0,
        title="Score",
        description="User's score.",
        examples=[100]
    )
    is_admin: bool = Field(
        default=False,
        title="Is Admin",
        description="Is user admin.",
        examples=[False]
    )

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    def check_password(self, password: str) -> bool:
        return checkpw(password.encode("utf-8"), self.password)

    class Settings:
        name = "Users"
        bson_encoders = {
            SnowflakeID: str
        }
        max_nesting_depth = 1


class UserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: str
    phone: str
    gender: GENDER_TYPE
    department: DEPARTMENT_TYPE
    department_level: int = Field(ge=1, le=10)
    password: str = Field(min_length=8)

    @field_validator("email")
    @classmethod
    def email_must_be_email(cls, value: str) -> str:
        if not check_is_email(value):
            raise ValueError
        return value

    @field_serializer("password")
    def password_auto_hash(self, value: str) -> Optional[bytes]:
        if value:
            return hashpw(value.encode("utf-8"), gensalt())
        return None


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = None
    gender: Optional[GENDER_TYPE] = None
    department: Optional[DEPARTMENT_TYPE] = None
    department_level: Optional[int] = Field(default=None, ge=1, le=10)
    password: Optional[str] = Field(default=None, min_length=8)
    original_password: Optional[str] = None

    @field_serializer("password")
    def password_auto_hash(self, value: str) -> Optional[bytes]:
        if value:
            return hashpw(value.encode("utf-8"), gensalt())
        return None


class GlobalUserView(BaseModel):
    uid: SnowflakeID
    name: str
    score: int
    department: DEPARTMENT_TYPE
    department_level: int


class UserView(GlobalUserView):
    email: str
    phone: str
    gender: GENDER_TYPE
    is_admin: bool
