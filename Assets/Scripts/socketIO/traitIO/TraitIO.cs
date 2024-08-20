using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TraitIO : MonoBehaviour
{
    private void Start()
    {
        TraitIOStart();
    }

    public void TraitIOStart()
    {
        //Cập nhật thông tin Tộc/Hệ
        SocketIO1.instance.socketManager.Socket.On<string, int>("update_trait", (_trait, currBreakpoint) => {
            Debug.Log("update_trait: " + _trait);
            JTrait trait = JsonConvert.DeserializeObject<JTrait>(_trait);
            TraitController.instance.UpdateTrait(trait, currBreakpoint);
        });
    }
}

[Serializable]
public class JTrait
{
    public string traitId;
    public string traitType;
    public string traitName;
    public string traitIcon;
    public string description;
    public int[] breakpoint;
    public string[] detailBreakpoint;
    public string[][] composition;
}

public enum TraitId
{
    Ranger,
    Assassin,
    Brawler,
    Mystic,
    Defender,
    Sorcerer,
    Skirmisher,
    Mascot,
    Hextech,
    Yordle,
    Nightbringer,
    Dawnbringer,
    Duelist,
}