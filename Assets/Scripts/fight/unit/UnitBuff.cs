using AYellowpaper.SerializedCollections;
using Newtonsoft.Json;
using PlayFab.EconomyModels;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class UnitBuff : MonoBehaviour
{
    [SerializeField] protected UnitAnim unitAnim;
    [SerializeField] protected Transform buffManger;
    [SerializeField] protected Canvas healthbar;
    [SerializeField] protected List<GameObject> buffEffectSpawned;
    [SerializedDictionary("BuffID", "BuffList")]
    [SerializeField] protected SerializedDictionary<string, GameObject> buffIconLst;

    protected virtual void Awake()
    {
        unitAnim = this.GetComponent<UnitAnim>();
        healthbar = this.GetComponentInChildren<Canvas>();
        buffEffectSpawned = new List<GameObject>();
        buffIconLst = new SerializedDictionary<string, GameObject>();
        for (int i = 0; i < this.transform.childCount; i++)
        {
            if (this.transform.GetChild(i).name == "BuffManager")
            {
                buffManger = this.transform.GetChild(i);
                break;
            }
        }
    }

    public void SpawnBuff(JBuff buff)
    {
        GameObject buffEffectObj = buffEffectSpawned.FirstOrDefault(x => x.name.Contains("buff" + buff.buffId) && x.activeSelf == false);
        if (buffEffectObj)
        {
            buffEffectObj.name = "buff" + buff.buffId + buff.networkId;
            buffEffectObj.SetActive(true);
            List<ParticleSystem> particleSystems = buffEffectObj.GetComponentsInChildren<ParticleSystem>().ToList();
            foreach (ParticleSystem particle in particleSystems)
            {
                particle.Play();
            }
        }
        else
        {
            buffEffectObj = new GameObject();
            buffEffectObj.name = "buff" + buff.buffId + buff.networkId;
            buffEffectObj.transform.parent = buffManger;
            buffEffectObj.transform.localPosition = Vector3.zero;
            if (buff.effect != null)
            {
                for (int i = 0; i < buff.effect.Length; i++)
                {
                    GameObject sePath = unitAnim.animSkillEffect[buff.effect[i].effectName];
                    GameObject effect = Instantiate(sePath, buffEffectObj.transform);
                }
            }
            buffEffectSpawned.Add(buffEffectObj);
        }
    }

    public void AddBuff(JBuff buff)
    {
        SpawnBuff(buff);
        if (!buff.buffDisplay)
        {
            return;
        }
        GameObject buffObj = null;
        if (buffIconLst.ContainsKey(buff.buffId))
        {
            buffObj = buffIconLst[buff.buffId];
            if (!buffObj.activeSelf)
            {
                buffObj.SetActive(true);
            }
        }
        else
        {
            buffObj = Instantiate(Resources.Load<GameObject>("prefabs/fight/buff/Prefab_BuffInfo"), healthbar.transform.GetChild(2));
            buffIconLst.Add(buff.buffId, buffObj);
        }
        if (buffObj == null)
        {
            return;
        }
        BuffInfo buffInfo = buffObj.GetComponent<BuffInfo>();
        buffInfo.buff = buff;
        buffInfo.imgBuffIcon.sprite = Resources.Load<Sprite>("image/skill/icon/" + buff.buffIcon);
        buffInfo.currLayer += 1;
        buffInfo.txtLayer.text = buffInfo.currLayer == 1 ? string.Empty : buffInfo.currLayer.ToString();
        buffInfo.lifetime = buff.buffDuration;
    }

    public void RemoveBuff(JBuff buff)
    {
        if (!buff.buffDisplay || !buffIconLst.ContainsKey(buff.buffId))
        {
            return;
        }
        BuffInfo buffInfo = buffIconLst[buff.buffId].GetComponent<BuffInfo>();
        if(buff.buffEndType == "Layer")
        {
            if (buffInfo.currLayer == 1)
            {
                DestroyBuff(buff);
            }
            else
            {
                buffInfo.currLayer -= 1;
                buffInfo.txtLayer.text = buffInfo.currLayer == 1 ? string.Empty : buffInfo.currLayer.ToString();
                buffInfo.lifetime = buff.buffDuration;
            }
        }
        else
        {
            DestroyBuff(buff);
        }
    }

    public void DestroyBuff(JBuff buff)
    {
        if (!buffIconLst.ContainsKey(buff.buffId))
        {
            return;
        }
        BuffInfo buffInfo = buffIconLst[buff.buffId].GetComponent<BuffInfo>();
        buffInfo.buff = null;
        buffInfo.imgBuffIcon.sprite = null;
        buffInfo.txtLayer.text = string.Empty;
        buffInfo.currLayer = 0;
        buffInfo.lifetime = 0;
        buffIconLst[buff.buffId].SetActive(false);
    }
}
