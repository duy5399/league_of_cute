using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class UnitIO : MonoBehaviour
{
    private void Start()
    {
        UnitIOStart();
    }

    public void UnitIOStart()
    {

    }
}

public class UnitStateIO : MonoBehaviour
{
    private void Start()
    {
        UnitStateIOStart();
    }

    public void UnitStateIOStart()
    {
        SocketIO1.instance.socketManager.Socket.On<string>("destroy_monster", (_unitState) => {
            Debug.Log("destroy_monster: " + _unitState);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            Destroy(unit);
        });

        //Reset state
        SocketIO1.instance.socketManager.Socket.On<string>("reset_state", (_jUnitState) => {
            Debug.Log("reset_state: " + _jUnitState);
            JUnitState jUnitState = JsonConvert.DeserializeObject<JUnitState>(_jUnitState);
            GameObject unit = RoomManager1.instance.FindUnit(jUnitState);
            if (!unit)
            {
                return;
            }
            unit.SetActive(true);
            UnitState unitState = unit.GetComponent<UnitState>();
            unitState.jUnitState = jUnitState;
            unit.transform.localPosition = new Vector3(jUnitState.position[0], jUnitState.position[1], jUnitState.position[2]);
            unit.transform.localRotation = Quaternion.identity;
        });
        //HP chnage
        SocketIO1.instance.socketManager.Socket.On<string, float, string>("play_hp_change", (_jUnitState, amount, color) => {
            Debug.Log("play_hp_change: " + _jUnitState + amount + color);
            JUnitState jUnitState = JsonConvert.DeserializeObject<JUnitState>(_jUnitState);
            GameObject unit = RoomManager1.instance.FindUnit(jUnitState);
            if (!unit)
            {
                return;
            }
            UnitState unitState = unit.GetComponent<UnitState>();
            unitState.jUnitState = jUnitState;
            Vector3 screenPosition = unit.transform.position;
            HpIndicatorController.instance.PlayHPChange(screenPosition, ((int)amount).ToString(), Enum.Parse<ColorStyle>(color));
        });

        //SP chnage
        SocketIO1.instance.socketManager.Socket.On<string>("trigger_sp_delta", (_jUnitState) => {
            Debug.Log("trigger_sp_delta: " + _jUnitState);
            JUnitState jUnitState = JsonConvert.DeserializeObject<JUnitState>(_jUnitState);
            List<GameObject> temp = new List<GameObject>();
            if (jUnitState.tag == "Champion")
            {
                temp = RoomManager1.instance.lstChampion;
            }
            else if (jUnitState.tag == "Monster")
            {
                temp = RoomManager1.instance.lstMonster;
            }
            GameObject unitObj = temp.FirstOrDefault(x => x.GetComponent<UnitState>().jUnitState.networkId == jUnitState.networkId);
            if (!unitObj)
            {
                return;
            }
            UnitState unitState = unitObj.GetComponent<UnitState>();
            unitState.jUnitState = jUnitState;
        });

        //Buff
        SocketIO1.instance.socketManager.Socket.On<string, string>("add_buff", (_unitState, _buff) => {
            Debug.Log("add_buff" + _buff);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            JBuff buff = JsonConvert.DeserializeObject<JBuff>(_buff);
            UnitBuff unitBuff = unit.GetComponent<UnitBuff>();
            if (!unitBuff)
            {
                return;
            }
            unitBuff.AddBuff(buff);
        });

        SocketIO1.instance.socketManager.Socket.On<string, string>("remove_buff", (_unitState, _buff) => {
            Debug.Log("remove_buff");
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            JBuff buff = JsonConvert.DeserializeObject<JBuff>(_buff);
            UnitBuff unitBuff = unit.GetComponent<UnitBuff>();
            if (!unitBuff)
            {
                return;
            }
            unitBuff.RemoveBuff(buff);
        });

        SocketIO1.instance.socketManager.Socket.On<string, string>("destroy_buff", (_unitState, _buff) => {
            Debug.Log("destroy_buff: " + _buff);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            JBuff buff = JsonConvert.DeserializeObject<JBuff>(_buff);
            UnitBuff unitBuff = unit.GetComponent<UnitBuff>();
            if (!unitBuff)
            {
                return;
            }
            unitBuff.DestroyBuff(buff);
        });
    }
}

public class UnitAnimIO : MonoBehaviour
{
    private void Start()
    {
        UnitAnimIOStart();
    }

    public void UnitAnimIOStart()
    {
        //Hoạt ảnh
        SocketIO1.instance.socketManager.Socket.On<string, string, float, bool, string>("trigger_anim_success", (_unitState, animName, animSpeed, force, _animEffect) => {
            Debug.Log("trigger_anim_success: " + _unitState + animName + animSpeed + force + _animEffect);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            List<AnimEffect> animEffect = JsonConvert.DeserializeObject<List<AnimEffect>>(_animEffect);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitAnim anim = unit.GetComponent<UnitAnim>();
            if (!anim)
            {
                return;
            }
            anim.TriggerAnim(animName, animSpeed, force, animEffect);
        });
    }
}



public class UnitMoveIO : MonoBehaviour
{
    private void Start()
    {
        UnitMoveIOStart();
    }

    public void UnitMoveIOStart()
    {
        //Di chuyển dơn vị sang sân đấu đối phương
        SocketIO1.instance.socketManager.Socket.On<string, string>("arrival_unit_to_other_arena", (arenaId, _unitState) => {
            Debug.Log("arrival_unit_to_other_arena: " + arenaId);
            GameObject arena = RoomManager1.instance.otherArena.Concat(new List<GameObject>() { RoomManager1.instance.myArena}).FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == arenaId);
            if (!arena)
            {
                return;
            }
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            unit.transform.parent = arena.transform;
            unit.transform.localPosition = new Vector3(unitState.position[0], unitState.position[1], unitState.position[2]);
//            unit.transform.rotation = new Quaternion(unitState.rotation[0], unitState.rotation[1], unitState.rotation[2], unitState.rotation[3]);
        });

        //Di chuyển
        SocketIO1.instance.socketManager.Socket.On<string>("unit_move_success", (_unitState) => {
            Debug.Log("unit_move_success: " + _unitState);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            unit.transform.localPosition = new Vector3(unitState.position[0], unitState.position[1], unitState.position[2]);
            unit.transform.rotation = new Quaternion(unitState.rotation[0], unitState.rotation[1], unitState.rotation[2], unitState.rotation[3]);
        });
    }
}

public class UnitSkillIO : MonoBehaviour
{
    private void Start()
    {
        UnitSkillIOStart();
    }

    public void UnitSkillIOStart()
    {
        //Di chuyển
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("spawn_hit_damage", (_unitState, _targetState, _skill) => {
            Debug.Log("spawn_hit_damage: " + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JUnitState targetState = JsonConvert.DeserializeObject<JUnitState>(_targetState);
            JHitDamage skill = JsonConvert.DeserializeObject<JHitDamage>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            GameObject target = RoomManager1.instance.FindUnit(targetState);
            if (!unit || !target)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnHitDamage(target, skill);
        });

        //follow target
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("spawn_follow_target", (_unitState, _targetState, _skill) => {
            Debug.Log("spawn_follow_target: " + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JUnitState targetState = JsonConvert.DeserializeObject<JUnitState>(_targetState);
            JFollowTarget skill = JsonConvert.DeserializeObject<JFollowTarget>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            GameObject target = RoomManager1.instance.FindUnit(targetState);
            if (!unit || !target)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnFollowTarget(target, skill);
        });
        
        //Fly out and back
        SocketIO1.instance.socketManager.Socket.On<string, float[], string>("spawn_fly_out_and_back", (_unitState, tempTargetPoint, _skill) => {
            Debug.Log("spawn_fly_out_and_back: " + tempTargetPoint + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JFlyOutAndBack skill = JsonConvert.DeserializeObject<JFlyOutAndBack>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnFlyOutAndBack(tempTargetPoint, skill);
        });

        //fixed direction
        SocketIO1.instance.socketManager.Socket.On<string, float[], string>("spawn_fixed_direction", (_unitState, tempTargetPoint, _skill) => {
            Debug.Log("spawn_fixed_direction: " + tempTargetPoint[0] + "," + tempTargetPoint[1] + "," + tempTargetPoint[2] + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JFixedDirection skill = JsonConvert.DeserializeObject<JFixedDirection>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnFixedDirection(tempTargetPoint, skill);
        });

        //bounce
        SocketIO1.instance.socketManager.Socket.On<string, string, string>("spawn_bounce", (_unitState, _targetState, _skill) => {
            Debug.Log("spawn_bounce: " + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JUnitState targetState = JsonConvert.DeserializeObject<JUnitState>(_targetState);
            JBounce skill = JsonConvert.DeserializeObject<JBounce>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            GameObject target = RoomManager1.instance.FindUnit(targetState);
            if (!unit || !target)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnBounce(target, skill);
        });

        SocketIO1.instance.socketManager.Socket.On<string, string, string>("spawn_rebounce", (_unitState, _targetState, _skill) => {
            Debug.Log("spawn_rebounce: " + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JUnitState targetState = JsonConvert.DeserializeObject<JUnitState>(_targetState);
            JBounce skill = JsonConvert.DeserializeObject<JBounce>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            GameObject target = RoomManager1.instance.FindUnit(targetState);
            if (!unit || !target)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.RespawnBounce(target, skill);
        });

        //aoe
        SocketIO1.instance.socketManager.Socket.On<string, float[], string>("spawn_aoe", (_unitState, tempTargetPoint, _skill) => {
            Debug.Log("spawn_aoe: " + tempTargetPoint[0] + "," + tempTargetPoint[1] + "," + tempTargetPoint[2] + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JAoE skill = JsonConvert.DeserializeObject<JAoE>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnAoe(tempTargetPoint, skill);
        });

        //bounce
        SocketIO1.instance.socketManager.Socket.On<string, string>("destory_skill_spawn", (_unitState, _skill) => {
            Debug.Log("destory_skill_spawn: " + _unitState + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JSkillSpawner skill = JsonConvert.DeserializeObject<JSkillSpawner>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.DestroySpawn(skill);
        });

        //aoe
        SocketIO1.instance.socketManager.Socket.On<string, float[], string>("spawn_channelling", (_unitState, tempTargetPoint, _skill) => {
            Debug.Log("spawn_channelling: " + tempTargetPoint[0] + "," + tempTargetPoint[1] + "," + tempTargetPoint[2] + _skill);
            JUnitState unitState = JsonConvert.DeserializeObject<JUnitState>(_unitState);
            JAoE skill = JsonConvert.DeserializeObject<JAoE>(_skill);
            GameObject unit = RoomManager1.instance.FindUnit(unitState);
            if (!unit)
            {
                return;
            }
            UnitSkill unitSkill = unit.GetComponent<UnitSkill>();
            unitSkill.SpawnAoe(tempTargetPoint, skill);
        });
    }
}

public enum UnitTag
{
    Champion,
    Monster
}

[Serializable]
public class JSkill
{
    public string skillId;
    public string skillName;
    public string skillType;
    public bool isNormalAttack;
    public string description;
    public string targetType;
    //public float range;
    public bool canBeSilenced;
    public bool canInterruptOnHeadTime;
    public bool canInterrupt;
    public bool canMoveWhenCast;
    public bool canCrit;
    //public string animName;
    public float castHeadTime;
    public float castingTime;
    public float castBackTime;
    public bool scaleAnimSpeed;
    //public string skillInfo;
    public string targetFilter;
    public bool canUseSelf;
    //public string searchAmong;
    public JHitDamage hitDamage;
    public JFollowTarget followTarget;
    public JFollowTarget flyOutAndBack;
}

[Serializable]
public class JSkillSpawner
{
    public string networkId;
    public string skillId;
    public JSkillEffect[] effect;
}

[Serializable]
public class JHitDamage : JSkillSpawner
{
    public float[] boxColSize;
    public float aoeMultiplier;
    public string damageType;
    public float adMultiplier;
    public float apMultiplier;
    public bool canCrit;
    public bool canLifesteal;
}

[Serializable]
public class JFollowTarget : JSkillSpawner
{
    public float speedFly;
    public string triggerOnHit;

}

[Serializable]
public class JFlyOutAndBack : JSkillSpawner
{
    public float speedFly;
    public string triggerOnHit;
}

[Serializable]
public class JFixedDirection : JSkillSpawner
{
    public float speedFly;
    public string triggerOnHit;
}

[Serializable]
public class JBounce : JSkillSpawner
{
    public float speedFly;
    public string triggerOnHit;
}

[Serializable]
public class JAoE : JSkillSpawner
{
    public string triggerOnHit;
}

[Serializable]
public class JSkillEffect : JSkillSpawner
{
    public string effectName;
    public float[] offset;
    public float delay;
    public float lifetime;
}
public enum SkillType
{
    Passive,
    Active,
}

public enum TriggerOnHit
{
    FirstCollision,
    EveryCollision,
    HitTarget
}

public enum TargetType
{
    Ally,
    Enemy,
    All
}

public enum TargetFilter
{
    Current,
    LowestHP,
    HighestHP,
    Nearest,
    Farthest,
    Random
}

public enum ColorStyle
{
    PhysicalDamage,
    PhysicalCritDamage,
    MagicalDamage,
    TrueDamage,
    Heal
}

[Serializable]
public class JBuff : JSkillSpawner
{
    public string buffId;
    public string buffName;
    public string buffDesc;
    public string buffIcon;
    public bool buffDisplay;
    public string buffEndType;
    public float buffDuration;
}
