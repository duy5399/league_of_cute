using AYellowpaper.SerializedCollections;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class UnitSkill : MonoBehaviour
{
    [SerializeField] protected UnitAnim unitAnim;
    [SerializeField] protected Transform attackPos;
    [SerializeField] protected GameObject target;
    [SerializeField] protected List<GameObject> skillSpawned;

    protected virtual void Awake()
    {
        unitAnim = this.GetComponent<UnitAnim>();
        skillSpawned = new List<GameObject>();
        for (int i = 0; i < this.transform.childCount; i++)
        {
            if (this.transform.GetChild(i).tag == "AttackPosition")
            {
                attackPos = this.transform.GetChild(i);
                break;
            }
        }
    }

    public void SpawnHitDamage(GameObject target, JHitDamage skill)
    {           
        GameObject hitDamageObj = skillSpawned.FirstOrDefault(x => x.name.Contains("hitDamage" + skill.skillId) && x.activeSelf == false);
        if (hitDamageObj)
        {
            hitDamageObj.name = "hitDamage" + skill.skillId + skill.networkId;
            hitDamageObj.transform.position = target.GetComponent<UnitState>().weakness.position;
            hitDamageObj.SetActive(true);
            List<ParticleSystem> particleSystems = hitDamageObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_HitDamage ttHitDamage = hitDamageObj.GetComponent<TT_HitDamage>();
            ttHitDamage.owner = this.gameObject;
            ttHitDamage.target1 = target;
            ttHitDamage.skill1 = skill;
            ttHitDamage.Launch();
        }
        else
        {
            hitDamageObj = new GameObject();
            hitDamageObj.name = "hitDamage" + skill.skillId + skill.networkId;
            hitDamageObj.transform.position = target.transform.position;
            if (skill.effect != null)
            {
                for (int i = 0; i < skill.effect.Length; i++)
                {
                    GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                    GameObject effect = Instantiate(sePath, hitDamageObj.transform);
                }
            }
            skillSpawned.Add(hitDamageObj);
            TT_HitDamage ttHitDamage = hitDamageObj.AddComponent<TT_HitDamage>();
            ttHitDamage.owner = this.gameObject;
            ttHitDamage.target1 = target;
            ttHitDamage.skill1 = skill;
            ttHitDamage.Launch();
        }
    }

    public void SpawnFollowTarget(GameObject target, JFollowTarget skill)
    {
        GameObject followTargetObj = skillSpawned.FirstOrDefault(x => x.name.Contains("followTarget" + skill.skillId) && x.activeSelf == false);
        if (followTargetObj)
        {
            followTargetObj.name = "followTarget" + skill.skillId + skill.networkId;
            followTargetObj.transform.position = attackPos.transform.position;
            followTargetObj.SetActive(true);
            List<ParticleSystem> particleSystems = followTargetObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_FollowTarget ttFollowTarget = followTargetObj.GetComponent<TT_FollowTarget>();
            ttFollowTarget.owner = this.gameObject;
            ttFollowTarget.target1 = target;
            ttFollowTarget.skill1 = skill;
            ttFollowTarget.Launch();
        }
        else
        {
            followTargetObj = new GameObject();
            followTargetObj.name = "followTarget" + skill.skillId + skill.networkId;
            followTargetObj.transform.position = attackPos.transform.position;
            skillSpawned.Add(followTargetObj);
            for (int i = 0; i < skill.effect.Length; i++)
            {
                GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                GameObject effect = Instantiate(sePath, followTargetObj.transform);
            }
            TT_FollowTarget ttFollowTarget = followTargetObj.AddComponent<TT_FollowTarget>();
            ttFollowTarget.owner = this.gameObject;
            ttFollowTarget.target1 = target;
            ttFollowTarget.skill1 = skill;
            ttFollowTarget.Launch();
        }
    }

    public void SpawnFlyOutAndBack(float[] tempTargetPoint, JFlyOutAndBack skill)
    {
        GameObject flyOutAndBackObj = skillSpawned.FirstOrDefault(x => x.name.Contains("flyOutAndBack" + skill.skillId) && x.activeSelf == false);
        if (flyOutAndBackObj)
        {
            flyOutAndBackObj.name = "flyOutAndBack" + skill.skillId + skill.networkId;
            flyOutAndBackObj.transform.position = attackPos.transform.position;
            flyOutAndBackObj.SetActive(true);
            List<ParticleSystem> particleSystems = flyOutAndBackObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_FlyOutAndBack ttFlyOutAndBack = flyOutAndBackObj.GetComponent<TT_FlyOutAndBack>();
            ttFlyOutAndBack.owner = this.gameObject;
            ttFlyOutAndBack.target1 = target;
            ttFlyOutAndBack.skill1 = skill;
            ttFlyOutAndBack.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            ttFlyOutAndBack.Launch();
        }
        else
        {
            flyOutAndBackObj = new GameObject();
            flyOutAndBackObj.name = "flyOutAndBack" + skill.skillId + skill.networkId;
            flyOutAndBackObj.transform.position = attackPos.transform.position;
            for (int i = 0; i < skill.effect.Length; i++)
            {
                GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                GameObject effect = Instantiate(sePath, flyOutAndBackObj.transform);
            }
            TT_FlyOutAndBack ttFlyOutAndBack = flyOutAndBackObj.AddComponent<TT_FlyOutAndBack>();
            ttFlyOutAndBack.owner = this.gameObject;
            ttFlyOutAndBack.target1 = target;
            ttFlyOutAndBack.skill1 = skill;
            ttFlyOutAndBack.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            ttFlyOutAndBack.Launch();
            skillSpawned.Add(flyOutAndBackObj);
        }
    }

    public void SpawnFixedDirection(float[] tempTargetPoint, JFixedDirection skill)
    {
        GameObject fixedDirectionObj = skillSpawned.FirstOrDefault(x => x.name.Contains("fixedDirection" + skill.skillId) && x.activeSelf == false);
        if (fixedDirectionObj)
        {
            fixedDirectionObj.name = "fixedDirection" + skill.skillId + skill.networkId;
            fixedDirectionObj.transform.position = attackPos.transform.position;
            fixedDirectionObj.SetActive(true);
            List<ParticleSystem> particleSystems = fixedDirectionObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_FixedDirection fixedDirection = fixedDirectionObj.GetComponent<TT_FixedDirection>();
            fixedDirection.owner = this.gameObject;
            fixedDirection.target1 = target;
            fixedDirection.skill1 = skill;
            fixedDirection.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            fixedDirection.Launch();
        }
        else
        {
            fixedDirectionObj = new GameObject();
            fixedDirectionObj.name = "fixedDirection" + skill.skillId + skill.networkId;
            fixedDirectionObj.transform.position = attackPos.transform.position;
            for (int i = 0; i < skill.effect.Length; i++)
            {
                GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                GameObject effect = Instantiate(sePath, fixedDirectionObj.transform);
            }
            TT_FixedDirection fixedDirection = fixedDirectionObj.AddComponent<TT_FixedDirection>();
            fixedDirection.owner = this.gameObject;
            fixedDirection.target1 = target;
            fixedDirection.skill1 = skill;
            fixedDirection.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            fixedDirection.Launch();
            skillSpawned.Add(fixedDirectionObj);
        }
    }

    public void SpawnBounce(GameObject target, JBounce skill)
    {
        GameObject followTargetObj = skillSpawned.FirstOrDefault(x => x.name.Contains("bounce" + skill.skillId) && x.activeSelf == false);
        if (followTargetObj)
        {
            followTargetObj.name = "bounce" + skill.skillId + skill.networkId;
            followTargetObj.transform.position = attackPos.transform.position;
            followTargetObj.SetActive(true);
            List<ParticleSystem> particleSystems = followTargetObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_Bounce ttBounce = followTargetObj.GetComponent<TT_Bounce>();
            ttBounce.owner = this.gameObject;
            ttBounce.target1 = target;
            ttBounce.skill1 = skill;
            ttBounce.Launch();
        }
        else
        {
            followTargetObj = new GameObject();
            followTargetObj.name = "bounce" + skill.skillId + skill.networkId;
            followTargetObj.transform.position = attackPos.transform.position;
            skillSpawned.Add(followTargetObj);
            for (int i = 0; i < skill.effect.Length; i++)
            {
                GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                GameObject effect = Instantiate(sePath, followTargetObj.transform);
            }
            TT_Bounce ttBounce = followTargetObj.AddComponent<TT_Bounce>();
            ttBounce.owner = this.gameObject;
            ttBounce.target1 = target;
            ttBounce.skill1 = skill;
            ttBounce.Launch();
        }
    }

    public void RespawnBounce(GameObject target, JBounce skill)
    {
        GameObject followTargetObj = skillSpawned.FirstOrDefault(x => x.name.Contains("bounce" + skill.skillId));
        if (!followTargetObj)
        {
            return;
        }
        List<ParticleSystem> particleSystems = followTargetObj.GetComponentsInChildren<ParticleSystem>().ToList();
        foreach (ParticleSystem particle in particleSystems)
        {
            particle.Play();
        }
        TT_Bounce ttBounce = followTargetObj.GetComponent<TT_Bounce>();
        ttBounce.target1 = target;
        ttBounce.Launch();
    }

    public void SpawnAoe(float[] tempTargetPoint, JAoE skill)
    {
        GameObject aoeObj = skillSpawned.FirstOrDefault(x => x.name.Contains("aoe" + skill.skillId) && x.activeSelf == false);
        if (aoeObj)
        {
            aoeObj.name = "aoe" + skill.skillId + skill.networkId;
            aoeObj.transform.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            aoeObj.SetActive(true);
            List<ParticleSystem> particleSystems = aoeObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
            TT_AOE aoe = aoeObj.GetComponent<TT_AOE>();
            aoe.owner = this.gameObject;
            aoe.target1 = target;
            aoe.skill1 = skill;
            //fixedDirection.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            //fixedDirection.Launch();
        }
        else
        {
            aoeObj = new GameObject();
            aoeObj.name = "aoe" + skill.skillId + skill.networkId;
            aoeObj.transform.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            if (skill.effect != null)
            {
                for (int i = 0; i < skill.effect.Length; i++)
                {
                    GameObject sePath = unitAnim.animSkillEffect[skill.effect[i].effectName];
                    GameObject effect = Instantiate(sePath, aoeObj.transform);
                }
            }
            TT_AOE aoe = aoeObj.AddComponent<TT_AOE>();
            aoe.owner = this.gameObject;
            aoe.target1 = target;
            aoe.skill1 = skill;
            //fixedDirection.tempTargetPoint.position = new Vector3(tempTargetPoint[0], tempTargetPoint[1], tempTargetPoint[2]);
            //fixedDirection.Launch();
            skillSpawned.Add(aoeObj);
        }
    }

    public void DestroySpawn(JSkillSpawner jSkillSpawner)
    {
        GameObject obj = skillSpawned.FirstOrDefault(x => x.name.Contains(jSkillSpawner.skillId + jSkillSpawner.networkId));
        if (!obj)
        {
            Debug.Log("DestroySpawn fail");
            return;
        }
        obj.gameObject.SetActive(false);
    }
}
