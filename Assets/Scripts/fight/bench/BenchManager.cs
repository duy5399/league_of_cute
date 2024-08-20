using AYellowpaper.SerializedCollections;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine;


public class BenchManager : MonoBehaviour
{
    public static BenchManager instance { get; private set; }

    [Header("Bench")]
    [SerializedDictionary("Slot", "Unit")]
    [SerializeField] private SerializedDictionary<GameObject, GameObject> dict_Bench;
    [SerializeField] private GameObject prefab_BenchSlot;
    [SerializeField] private const int MAX_ROWS = 1;
    [SerializeField] private const int MAX_COLS = 9;
    [SerializeField] private const float SPACE_SLOT = 2.1f;
    [SerializeField] private const float START_POINT = -9.13f;

    public SerializedDictionary<GameObject, GameObject> _dict_Bench => dict_Bench;

    private void Awake()
    {
        if (instance != null && instance != this)
            Destroy(this);
        else
            instance = this;
    }

    private void Start()
    {
        //CreateBench();
    }

    public void AddUnit(JBenchTile jTile, JUnitState jUnitState, bool isOwner)
    {
        GameObject benchTile;
        if (isOwner)
        {
            benchTile = RoomManager1.instance.myBenchTile.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTile.networkId);
        }
        else
        {
            benchTile = RoomManager1.instance.otherBenchTile.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == jTile.networkId);
        }
        GameObject championPath = Resources.Load<GameObject>("prefabs/fight/units/" + jUnitState.unitId);
        GameObject championObj = Instantiate(championPath);
        championObj.transform.parent = benchTile.transform.parent;
        championObj.transform.localPosition = benchTile.transform.localPosition;
        NetworkObject networkObject = championObj.AddComponent<NetworkObject>();
        networkObject.networkId = jUnitState.networkId;
        networkObject.isOwner = isOwner;
        ChampionState championState = championObj.AddComponent<ChampionState>();
        championState.jUnitState = jUnitState;
        ChampionDragDrop drag = championObj.AddComponent<ChampionDragDrop>();
        championState.jUnitState = jUnitState;
        ChampionHealthbar chHealthbar = championObj.AddComponent<ChampionHealthbar>();
        ChampionAnim championAnim = championObj.AddComponent<ChampionAnim>();
        UnitSkill championSkill = championObj.AddComponent<UnitSkill>();
        UnitBuff championBuff = championObj.AddComponent<UnitBuff>();
        UnitItem championItem = championObj.AddComponent<UnitItem>();
        //obj.GetComponent<ChampionInfo1>().chStat = newUnit.unit;
        //obj.GetComponent<ChampionInfo1>().chCategory = ChampionInfo1.Categories.Hero;
        //obj.GetComponent<ChampionInfo1>().dragDrop.currentParent = slotBench.transform;
        //obj.GetComponent<ChampionInfo1>().SetName(newUnit.unit.championName + "_" + newUnit.unit._id);
        //obj.GetComponent<ChampionInfo1>().SetParent(slotBench.GetPhotonView().ViewID);
        //Debug.Log("InitState AddNewUnit");
        //obj.GetComponent<ChampionInfo1>().currentState.InitState();
        //dict_Bench[slotBench] = obj;
        RoomManager1.instance.lstChampion.Add(championObj);
    }

    public void ActiveBench(bool isActive)
    {
        
    }

    //public void SetActiveBench(bool boolean)
    //{
    //    foreach (var x in dict_Bench)
    //    {
    //        if (x.Key.tag == "BattlefieldSide" && x.Key.gameObject.layer == LayerMask.NameToLayer("DropArea"))
    //            x.Key.GetComponent<MeshRenderer>().enabled = boolean;
    //        else
    //            x.Key.GetComponent<MeshRenderer>().enabled = false;
    //    }
    //}
}
