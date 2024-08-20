const ConnectionState = Object.freeze({
    Connecting : 'Connecting',
    Connected : 'Connected',
    Disconnected : 'Disconnected',
});

module.exports.ConnectionState = ConnectionState;

const TileTag = {
    Bench : 'Bench',
    Battlefield : 'Battlefield',
    Inventory : 'Inventory'
};

module.exports.TileTag = TileTag;

const Phases = Object.freeze({
    Planning : 'Planning',
    Arrival: 'Arrival',
    Battle : 'Battle',
    End : 'End',
});

module.exports.Phases = Phases;

const RoundMode = Object.freeze({
    Carousel : 'Carousel',
    PvE : 'PvE',
    PvP : 'PvP',
});

module.exports.RoundMode = RoundMode;

const UnitTag = Object.freeze({
    Champion: 'Champion',
    Monster : 'Monster',
});

module.exports.UnitTag = UnitTag;

const UnitStatus = Object.freeze({
    Resting: 'Resting',
    ReadyToFight : 'ReadyToFight',
    Fighting: 'Fighting',
    EndFight : 'EndFight',
});

module.exports.UnitStatus = UnitStatus;

const LobbyStatus = Object.freeze({
    None : 'None',
    FindingMatch : 'FindingMatch',
    Ingame : 'Ingame'
});

module.exports.LobbyStatus = LobbyStatus;

const ItemClass = Object.freeze({
    Tactician : 'Tactician',
    ArenaSkin : 'ArenaSkin',
    Boom : 'Boom'
});

module.exports.ItemClass = ItemClass;

const OnArea = Object.freeze({
    Bench : 'Bench',
    Battlefield : 'Battlefield'
});

module.exports.OnArea = OnArea;

//---------Behaviour Tree
const NodeState = Object.freeze({
    Running : 'Running',
    Success : 'Success',
    Failure : 'Failure'
});
    
module.exports.NodeState = NodeState;

//-----------move
const MoveState = Object.freeze({
    Standing: 'Standing',
    FindingNearestTarget: 'FindingNearestTarget',
    FindingShortestPath : 'FindingShortestPath',
    MovingToTarget : 'MovingToTarget',
});

module.exports.MoveState = MoveState;

//-----------------AnimManager
const AnimStatus = Object.freeze({
    Idle: 'Idle',
    Run: 'Run',
    Death : 'Death',
    Other : 'Other',
});

module.exports.AnimStatus = AnimStatus;
//----------skill
const SkillType = Object.freeze({
    NormalAttack : 'NormalAttack',
    Passive : 'Passive',
    Active : 'Active'
});

const SkillTargetType = Object.freeze({
    Self : 'Self',
    Ally : 'Ally',  
    Ally_No_Me : 'Ally_No_Me',
    Enemy : 'Enemy'
});

const SkillPos = Object.freeze({
    Self : 'Self',              //vị trí ngay bản thân
    AroundSelf : 'AroundSelf',  //vị trí là xung quanh bản thân
    Target : 'Target',          //vị trí ngay mục tiêu
    AroundTarget : 'AroundTarget',  //vị trí xung quanh mục tiêu
});

const SkillShapeType = Object.freeze({
    Single : 'Single',
    Rectangle : "Rectangle",
    CircularSector : "CircularSector",
    Circle : "Circle"
});

const Logic = Object.freeze({
    Single : 'Single',
    Range : 'Range'
});

module.exports.SkillTargetType = SkillTargetType;
module.exports.SkillType = SkillType;
module.exports.SkillPos = SkillPos;
module.exports.SkillShapeType = SkillShapeType;
module.exports.Logic = Logic;



const CastStatus = Object.freeze({
    None : 'None',
    CastHead : 'CastHead',
    Casting : 'Casting',
    CastBack : 'CastBack',
    End : 'End',
});

const SearchAmong = Object.freeze({
    Ally : 'Ally',
    Enemy : 'Enemy',
    All : 'All',
});

const TargetFilter = Object.freeze({
    Current : 'Current',
    LowestHP : 'LowestHP',
    HighestHP : 'HighestHP',
    Nearest : 'Nearest',
    Farthest : 'Farthest',
    Random : 'Random',
});

const TargetingType = Object.freeze({
    FollowTarget : 'FollowTarget',
    FixedDirection : 'FixedDirection',
    FlyAndBack : 'FlyAndBack',
    Bounce : 'Bounce',
    AoE : 'AoE',
    Channelling : 'Channelling',
});

module.exports.CastStatus = CastStatus;
module.exports.SearchAmong = SearchAmong;
module.exports.TargetFilter = TargetFilter;
module.exports.TargetingType = TargetingType;
//

const TriggerOnHit = Object.freeze({
    FirstCollision : 'FirstCollision',
    EveryCollision : 'EveryCollision',
    HitTarget : 'HitTarget',
});

const HitOn = Object.freeze({
    Target : 'Target',
	TargetPos : 'TargetPos',
	AroundSelf : 'AroundSelf'
});

const DamageType = Object.freeze({
    AD : 'AD',
    AP : 'AP',
    True : 'True',
});

module.exports.TriggerOnHit = TriggerOnHit;
module.exports.HitOn = HitOn;
module.exports.DamageType = DamageType;

const ColorStyle = 
{
    PhysicalDamage : 'PhysicalDamage',
    PhysicalCritDamage : 'PhysicalCritDamage',
    MagicalDamage : 'MagicalDamage',
    TrueDamage : 'TrueDamage',
    Heal : 'Heal',
}

module.exports.ColorStyle = ColorStyle;

//-----------Buff
const CrowdControlType = 
{
    Airborne : 'Airborne',
    Blind : 'Blind',
    Silence : 'Silence',
    Stun : 'Stun',
    Slow : 'Slow',
    Root : 'Root',
}

const BuffMultipleAddType = Object.freeze({
    //Xóa buff cũ và thay thế bằng buff mới
    Overlay : 'Overlay',
    //Xóa buff nếu đã có buff tồn tại
    Suicide : 'Suicide',
    //Cập nhật thời gian buff
    ResetTime : 'ResetTime',
    //Xếp chồng buff
    MultiLayer : 'MultiLayer',
    //Xếp chồng buff và làm mới các buff cùng loại đã có
    MultiLayerAndRefresh : 'MultiLayerAndRefresh',
});

const BuffRemoveType = Object.freeze({
    All : 'All',
    Layer : 'Layer',
});

const BuffType = Object.freeze({
    None : 'None',
    AbilityCanCrit : 'AbilityCanCrit',     //thay đổi chỉ số
    AttrChange : 'AttrChange',     //thay đổi chỉ số
    AddBuff : 'AddBuff',         //thêm buff
    DelBuff : 'DelBuff',        //xóa buff
    AddStatus : 'AddStatus',      //thêm trạng thái khống chế
    DelStatus : 'DelStatus',      //xóa trạng thái khống chế
    Heal : 'Heal',     //hồi hp/sp
    HPSPChange : 'HPSPChange',     //hồi hp/sp
    AbsorbDamage : 'AbsorbDamage',   //lá chắn
    LimitUseItem : 'LimitUseItem',   //giới hạn vật phẩm
    Disperse : 'Disperse',           //xóa hiệu ứng debuff
    NoDisperse : 'NoDisperse',     //không thể xóa hiệu ứng debuff
    NoDelStatus : 'NoDelStatus',   //không thể xóa trạng thái khống chế
    DamageToHeal : 'DamageToHeal',  //chuyển sát thương thành hp
    LimitSkill : 'LimitSkill',    //giới hạn kỹ năng
    SpRecover : 'SpRecover',     //hồi p 
    DisableSpRecover : 'DisableSpRecover',     //hồi p 
    ImmuneStatus : 'ImmuneStatus',  //kháng trạng thái khống chế   
    ImmuneAttack : 'ImmuneAttack',  //kháng sát thương
    ShareDamage : 'ShareDamage',   //chia sẻ sát thương
    AutoBlock : 'AutoBlock',     
    DisableSkill : 'DisableSkill',
    ClearSkillCD : 'ClearSkillCD',
    AbilityCanCrit : 'AbilityCanCrit'
});

const BuffEventType = Object.freeze({
    OnNone : 'OnNone',
    OnStartBattle : 'OnStartBattle',
    OnCreate : 'OnCreate',
    OnNormalAttack : 'OnNormalAttack',
    OnAbility : 'OnAbility',
    OnHit : 'OnHit',
    OnNormalAttackTarget : 'OnNormalAttackTarget',
    OnAbilityTarget : 'OnAbilityTarget',
    OnBeHitted : 'OnBeHitted',
    OnBeHittedByNormalAttack : 'OnBeHittedByNormalAttack',
    OnBeHittedByAbility : 'OnBeHittedByAbility',
    OnBeforeDamageOnTarget : 'OnBeforeDamageOnTarget',
    OnBeforeDamageOnSelf : 'OnBeforeDamageOnSelf',
    OnBeforeHeal : 'OnBeforeHeal',
    OnBeControl : 'OnBeControl',
    OnBeforeDeath : 'OnBeforeDeath',
    OnAfterDeath : 'OnAfterDeath',
    OnAssist : 'OnAssist',
    OnKill : 'OnKill',
});

const BuffOn = Object.freeze({
	Caster : 'Caster',
	Target : 'Target'
});


const BuffAppendType =  Object.freeze({
	Add : 'Add',
	Mult : 'Mult'
});

    
module.exports.CrowdControlType = CrowdControlType;
module.exports.BuffMultipleAddType = BuffMultipleAddType;
module.exports.BuffRemoveType = BuffRemoveType;
module.exports.BuffType = BuffType;
module.exports.BuffEventType = BuffEventType;
module.exports.BuffOn = BuffOn;
module.exports.BuffAppendType = BuffAppendType;

//Hệ/Tộc
const TraitId =  Object.freeze({
	Ranger : 'Ranger',
    Assassin : 'Assassin',
    Brawler : 'Brawler',
    Mystic : 'Mystic',
    Defender : 'Defender',
    Sorcerer : 'Sorcerer',
    Skirmisher : 'Skirmisher',
    Mascot : 'Mascot',
    Hextech : 'Hextech',
	Yordle : 'Yordle',
    Nightbringer : 'Nightbringer',
    Dawnbringer : 'Dawnbringer',
    Duelist : 'Duelist'
});

module.exports.TraitId = TraitId;

//Item
const ItemTag =  Object.freeze({
	Gold : 'Gold',
    Item : 'Item',
});

const ItemType =  Object.freeze({
	Component : 'Component',
    Core : 'Core',
});

module.exports.ItemTag = ItemTag;
module.exports.ItemType = ItemType;

//Trang bị
const ItemId =  Object.freeze({
	Deathblade : 'Deathblade',
    Giant_Slayer : 'Giant_Slayer',
    Edge_of_Night : 'Edge_of_Night',
    Bloodthirster : 'Bloodthirster',
    Hextech_Gunblade : 'Hextech_Gunblade',
    Spear_of_Shojin : 'Spear_of_Shojin',
    Steraks_Gage : 'Steraks_Gage',
    Infinity_Edge : 'Infinity_Edge',
    Rapid_Firecannon : 'Rapid_Firecannon',
    Titans_Resolve : 'Titans_Resolve',
    Zekes_Herald : 'Zekes_Herald',
    Guinsoos_Rageblade : 'Guinsoos_Rageblade',
    Sword_Breaker : 'Sword_Breaker',
	Nashors_Tooth : 'Nashors_Tooth',
    Last_Whisper : 'Last_Whisper',
    Bramble_Vest : 'Bramble_Vest',
    Gargoyle_Stoneplate : 'Gargoyle_Stoneplate',
    Crownguard : 'Crownguard',
    Protectors_Vow : 'Protectors_Vow',
    Sunfire_Cape : 'Sunfire_Cape',
    Steadfast_Heart : 'Steadfast_Heart',
    Dragons_Claw : 'Dragons_Claw',
    Ionic_Spark : 'Ionic_Spark',
    Adaptive_Helm : 'Adaptive_Helm',
    Evenshroud : 'Evenshroud',
    Quicksilver : 'Quicksilver',
    Rabadons_Deathcap : 'Rabadons_Deathcap',
    Archangels_Staff : 'Archangels_Staff',
    Night_Harvester : 'Night_Harvester',
    Jeweled_Gauntlet : 'Jeweled_Gauntlet',
    Blue_Buff : 'Blue_Buff',
    Redemption : 'Redemption',
    Hand_of_Justice : 'Hand_of_Justice',
    Warmogs_Armor : 'Warmogs_Armor',
    Guardbreaker : 'Guardbreaker',
    Thiefs_Gloves : 'Thiefs_Gloves',
    BF_Sword : 'BF_Sword',
    Recurve_Bow : 'Recurve_Bow',
    Chain_Vest : 'Chain_Vest',
    Negatron_Cloak : 'Negatron_Cloak',
    Needlessly_Large_Rod : 'Needlessly_Large_Rod',
    Tear_Of_The_Goddess : 'Tear_Of_The_Goddess',
    Giants_Belt : 'Giants_Belt',
    Sparring_Gloves : 'Sparring_Gloves'
});

module.exports.ItemId = ItemId;

const Rank =  Object.freeze({
	Bronze : 'Bronze',
    Silver : 'Silver',
    Gold : 'Gold',
    Platinum : 'Platinum',
    Diamond : 'Diamond',
    Master : 'Master',
    Grandmaster : 'Grandmaster',
    Challenger : 'Challenger'
});

module.exports.Rank = Rank;