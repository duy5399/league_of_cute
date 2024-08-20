using AYellowpaper.SerializedCollections;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.TextCore.Text;
using UnityEngine.UI;
using UnityEngine.UIElements;

public class RoomManager1 : MonoBehaviour
{
    public static RoomManager1 instance { get; private set; }

    public GameObject myTactician;
    public GameObject myArena;
    public List<GameObject> myBenchTile;
    public List<GameObject> myBattlefieldTile;
    public List<GameObject> myItemInventoryTile;

    public List<GameObject> otherTactician;
    public List<GameObject> otherArena;

    public List<GameObject> otherBenchTile;
    public List<GameObject> otherBattlefieldTile;
    public List<GameObject> otherItemInventoryTile;

    public List<GameObject> lstChampion;
    public List<GameObject> lstMonster;
    public List<GameObject> lstItem;

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

        myBenchTile = new List<GameObject>();
        myBattlefieldTile = new List<GameObject>();
        otherTactician = new List<GameObject>();
        otherArena = new List<GameObject>();
        otherBenchTile = new List<GameObject>();
        otherBattlefieldTile = new List<GameObject>();
    }

    //Khởi tạo Linh thú
    public void InstantiateTactician(JTacticianState jTacticianState, Vector3 position, bool isOwner)
    {
        GameObject tacticianPath = Resources.Load<GameObject>("prefabs/fight/tacticians/" + jTacticianState.tacticianInfo.itemId);
        GameObject tacticianObj = Instantiate(tacticianPath, position, tacticianPath.transform.rotation);
        NetworkObject networkObject = tacticianObj.AddComponent<NetworkObject>();
        networkObject.networkId = jTacticianState.networkId;
        networkObject.isOwner = isOwner;
        TacticianState tacticianState = tacticianObj.AddComponent<TacticianState>();
        TacticianAnim tacticianAnim = tacticianObj.AddComponent<TacticianAnim>();
        TacticianMove tacticianMove = tacticianObj.AddComponent<TacticianMove>();
        TacticianHealthbar tacticianHealthbar = tacticianObj.AddComponent<TacticianHealthbar>();
        tacticianState.jTacticianState = jTacticianState;
        tacticianHealthbar.Nickname(tacticianState.jTacticianState.nickname);
        tacticianHealthbar.Level(tacticianState.jTacticianState.level);
        if (isOwner)
        {
            myTactician = tacticianObj;
        }
        else
        {
            otherTactician.Add(tacticianObj);
        }
    }

    //Khởi tạo Sân đấu
    public void InstantiateArenaSkin(JStoreItemInfo arenaSkinInfo, Vector3 position, string networkId, bool isOwner)
    {
        GameObject mainboardPath = Resources.Load<GameObject>("prefabs/fight/arenas/Mainboard");
        GameObject mainboardObj = Instantiate(mainboardPath, position, mainboardPath.transform.rotation);
        ArenaSkin arenaSkin = mainboardObj.GetComponent<ArenaSkin>();
        arenaSkin.ChangeArenaSkin(arenaSkinInfo.itemId);
        GameObject arenaObj = new GameObject();
        arenaObj.name = "Arena";
        arenaObj.transform.parent = mainboardObj.transform;
        arenaObj.transform.localPosition = Vector3.zero;
        NetworkObject networkObject = arenaObj.AddComponent<NetworkObject>();
        networkObject.networkId = networkId;
        networkObject.isOwner = isOwner;
        if (isOwner)
        {
            myArena = arenaObj;
        }
        else
        {
            otherArena.Add(arenaObj);
        }
    }

    //Khởi tạo Hàng đợi
    public void InstantiateBench(JBenchTile benchTile, string networdId, bool isOwner)
    {
        StartCoroutine(Coroutine_InstantiateBench(benchTile, networdId, isOwner));
    }

    IEnumerator Coroutine_InstantiateBench(JBenchTile benchTile, string networdId, bool isOwner)
    {
        yield return new WaitUntil(() => myArena != null);
        GameObject benchTilePath = Resources.Load<GameObject>("prefabs/fight/arenas/BenchTile");
        GameObject benchTileObj = Instantiate(benchTilePath);
        if (isOwner)
        {
            benchTileObj.transform.parent = myArena.transform;
            myBenchTile.Add(benchTileObj);
        }
        else
        {
            GameObject arenaObj = otherArena.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networdId);
            if (!arenaObj)
            {
                yield return null;
            }
            benchTileObj.transform.parent = arenaObj.transform;
            otherBenchTile.Add(benchTileObj);
        }
        benchTileObj.transform.localPosition = new Vector3(benchTile.position[0], benchTile.position[1], benchTile.position[2]);
        Tile tile = benchTileObj.AddComponent<Tile>();
        tile.tile = benchTile;
        NetworkObject networkObject = benchTileObj.AddComponent<NetworkObject>();
        networkObject.networkId = benchTile.networkId;
        networkObject.isOwner = isOwner;
        benchTileObj.GetComponent<Tile>().Active(false);
    }



    //Khởi tạo Sàn Đấu
    public void InstantiateBattlefield(JBattlefieldTile battlefieldTile, string networdId, bool isOwner)
    {
        StartCoroutine(Coroutine_InstantiateBattlefield(battlefieldTile, networdId, isOwner));
    }

    IEnumerator Coroutine_InstantiateBattlefield(JBattlefieldTile battlefieldTile, string networdId, bool isOwner)
    {
        yield return new WaitUntil(() => myArena != null);
        GameObject battlefieldTilePath = Resources.Load<GameObject>("prefabs/fight/arenas/BattlefieldTile");
        GameObject battlefieldTileObj = Instantiate(battlefieldTilePath);
        if (isOwner)
        {
            battlefieldTileObj.transform.parent = myArena.transform;
            myBattlefieldTile.Add(battlefieldTileObj);
        }
        else
        {
            GameObject arenaObj = otherArena.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networdId);
            if (!arenaObj)
            {
                yield return null;
            }
            battlefieldTileObj.transform.parent = arenaObj.transform;
            otherBattlefieldTile.Add(battlefieldTileObj);
        }
        battlefieldTileObj.transform.localPosition = new Vector3(battlefieldTile.position[0], battlefieldTile.position[1], battlefieldTile.position[2]);
        Tile tile = battlefieldTileObj.AddComponent<Tile>();
        tile.tile = battlefieldTile;
        NetworkObject networkObject = battlefieldTileObj.AddComponent<NetworkObject>();
        networkObject.networkId = battlefieldTile.networkId;
        networkObject.isOwner = isOwner;
        battlefieldTileObj.GetComponent<Tile>().Active(false);
    }

    //Khởi tạo Kho vật phẩm
    public void InstantiateItemInventory(JItemInventoryTile itemInventoryTile, string networdId, bool isOwner)
    {
        StartCoroutine(Coroutine_InstantiateItemInventory(itemInventoryTile, networdId, isOwner));
    }

    IEnumerator Coroutine_InstantiateItemInventory(JItemInventoryTile itemInventoryTile, string networdId, bool isOwner)
    {
        yield return new WaitUntil(() => myArena != null);
        GameObject itemInventoryTilePath = Resources.Load<GameObject>("prefabs/fight/arenas/ItemInventoryTile");
        GameObject itemInventoryTileObj = Instantiate(itemInventoryTilePath);
        if (isOwner)
        {
            itemInventoryTileObj.transform.parent = myArena.transform;
            myItemInventoryTile.Add(itemInventoryTileObj);
        }
        else
        {
            GameObject arenaObj = otherArena.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networdId);
            if (!arenaObj)
            {
                yield return null;
            }
            itemInventoryTileObj.transform.parent = arenaObj.transform;
            otherItemInventoryTile.Add(itemInventoryTileObj);
        }
        itemInventoryTileObj.transform.localPosition = new Vector3(itemInventoryTile.position[0], itemInventoryTile.position[1], itemInventoryTile.position[2]);
        Tile tile = itemInventoryTileObj.AddComponent<Tile>();
        tile.tile = itemInventoryTile;
        NetworkObject networkObject = itemInventoryTileObj.AddComponent<NetworkObject>();
        networkObject.networkId = itemInventoryTile.networkId;
        networkObject.isOwner = isOwner;
    }

    public void TacticianMove(string networkId, Vector3 position)
    {
        GameObject tactician = otherTactician.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networkId);
        if (!tactician)
        {
            return;
        }
        tactician.transform.position = position;
    }

    public void TacticianRotate(string networkId, Quaternion rotation)
    {
        GameObject tactician = otherTactician.FirstOrDefault(x => x.GetComponent<NetworkObject>().networkId == networkId);
        if (!tactician)
        {
            return;
        }
        tactician.transform.rotation = rotation;
    }

    public void UpgradeUnit(JUnitState unitState)
    {
        GameObject championObj = lstChampion.FirstOrDefault(x => x.GetComponent<ChampionState>().jUnitState.networkId == unitState.networkId);
        if (!championObj)
        {
            return;
        }
        Debug.Log("UpgradeUnit");
        ChampionState chState = championObj.GetComponent<ChampionState>();
        chState.jUnitState = unitState;
        ChampionHealthbar chHealthbar = championObj.GetComponent<ChampionHealthbar>();
        chHealthbar.Level(unitState.level);
        //champion.SetImageStar(upgradeUnit.currentLevel.star);
        GameObject upgradeUnitVFXPath = Resources.Load<GameObject>("prefabs/vfx/vfx_MagicAbility_Electric");
        GameObject upgradeUnitVFX = Instantiate(upgradeUnitVFXPath, championObj.transform.position, Quaternion.identity);
    }

    public void DeleteUnit(JUnitState unitState)
    {
        GameObject championObj = lstChampion.FirstOrDefault(x => x.GetComponent<ChampionState>().jUnitState.networkId == unitState.networkId);
        if (!championObj)
        {
            return;
        }
        lstChampion.Remove(championObj);
        Destroy(championObj);
    }

    public void DragDropUnit(JTile jTile, JUnitState jUnitState, bool isOwner)
    {
        GameObject championObj = lstChampion.FirstOrDefault(x => x.GetComponent<ChampionState>().jUnitState.networkId == jUnitState.networkId);
        if (!championObj)
        {
            return;
        }
        GameObject tileObj = null;
        if((TileTag)Enum.Parse(typeof(TileTag), jTile.tag) == TileTag.Bench)
        {
            if (isOwner)
            {
                tileObj = myBenchTile.FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == jTile.networkId);
            }
            else
            {
                tileObj = otherBenchTile.FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == jTile.networkId);
            }
        }
        else if ((TileTag)Enum.Parse(typeof(TileTag), jTile.tag) == TileTag.Battlefield)
        {
            if (isOwner)
            {
                tileObj = myBattlefieldTile.FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == jTile.networkId);
            }
            else
            {
                tileObj = otherBattlefieldTile.FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == jTile.networkId);
            }
        }
        if(tileObj == null)
        {
            return;
        }

        ChampionState chState = championObj.GetComponent<ChampionState>();
        chState.jUnitState = jUnitState;
        championObj.transform.position = tileObj.transform.position;
        Debug.Log("DragDropUnit: " + jUnitState.hp + jUnitState.maxHP);
    }

    public GameObject FindUnit(JUnitState unitState)
    {
        GameObject unit;
        //Nếu unit có tag là Champion
        if ((UnitTag)Enum.Parse(typeof(UnitTag), unitState.tag) == UnitTag.Champion)
        {
            unit = lstChampion.FirstOrDefault(x => x.GetComponent<ChampionState>().jUnitState.networkId == unitState.networkId);
        }
        else
        {
            lstMonster.RemoveAll(x => x == null);
            unit = lstMonster.FirstOrDefault(x => x.GetComponent<ChampionState>().jUnitState.networkId == unitState.networkId);
        }
        return unit;
    }

    public GameObject FindBattlefileTile(JUnitState unitState)
    {
        return myBattlefieldTile.Concat(otherBattlefieldTile).FirstOrDefault(x => x.GetComponent<Tile>().tile.networkId == unitState.currTileId);
    }

    public GameObject FindItem(JItemBase jItemBase)
    {
        return lstItem.FirstOrDefault(x => x.GetComponent<ItemBase1>().jItemBase.networkId == jItemBase.networkId);
    }
}
