using AYellowpaper.SerializedCollections;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class BattlefieldManager : MonoBehaviour
{
    public static BattlefieldManager instance { get; private set; }

    [Header("Bench")]
    [SerializedDictionary("Slot", "Unit")]
    [SerializeField] private SerializedDictionary<GameObject, GameObject> dict_Bench;

    public SerializedDictionary<GameObject, GameObject> _dict_Bench => dict_Bench;

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this);
        }
        else
        {
            instance = this;
        }
    }

    private void Start()
    {
        
    }

    public void AddMonster(JUnitState tile, bool isOwner)
    {
        GameObject battlefieldTile;
        if (isOwner)
        {
            battlefieldTile = RoomManager1.instance.myBattlefieldTile.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == tile.currTileId);
        }
        else
        {
            battlefieldTile = RoomManager1.instance.otherBattlefieldTile.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == tile.currTileId);
        }
        if (!battlefieldTile)
        {
            return;
        }
        GameObject monsterPath = Resources.Load<GameObject>("prefabs/fight/units/" + tile.unitId);
        GameObject monsterObj = Instantiate(monsterPath);
        Debug.Log(battlefieldTile.name);
        Debug.Log(monsterObj.name);
        monsterObj.transform.parent = battlefieldTile.transform.parent;
        monsterObj.transform.position = battlefieldTile.transform.position;
        NetworkObject networkObject = monsterObj.AddComponent<NetworkObject>();
        networkObject.networkId = tile.networkId;
        networkObject.isOwner = isOwner;
        ChampionState championState = monsterObj.AddComponent<ChampionState>();
        championState.jUnitState = tile;
        ChampionDragDrop drag = monsterObj.AddComponent<ChampionDragDrop>();
        championState.jUnitState = tile;
        ChampionHealthbar chHealthbar = monsterObj.AddComponent<ChampionHealthbar>();

        MonsterAnim monsterAnim = monsterObj.AddComponent<MonsterAnim>();
        UnitSkill monsterSkill = monsterObj.AddComponent<UnitSkill>();
        UnitBuff monsterBuff = monsterObj.AddComponent<UnitBuff>();

        //obj.GetComponent<ChampionInfo1>().chStat = newUnit.unit;
        //obj.GetComponent<ChampionInfo1>().chCategory = ChampionInfo1.Categories.Hero;
        //obj.GetComponent<ChampionInfo1>().dragDrop.currentParent = slotBench.transform;
        //obj.GetComponent<ChampionInfo1>().SetName(newUnit.unit.championName + "_" + newUnit.unit._id);
        //obj.GetComponent<ChampionInfo1>().SetParent(slotBench.GetPhotonView().ViewID);
        //Debug.Log("InitState AddNewUnit");
        //obj.GetComponent<ChampionInfo1>().currentState.InitState();
        //dict_Bench[slotBench] = obj;
        RoomManager1.instance.lstMonster.Add(monsterObj);
    }
}
