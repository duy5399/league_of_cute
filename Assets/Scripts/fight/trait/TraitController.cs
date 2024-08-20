using AYellowpaper.SerializedCollections;

using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.TextCore.Text;
using UnityEngine.UIElements;

public class TraitController : MonoBehaviour
{
    public static TraitController instance { get; private set; }
    [SerializeField] private SerializedDictionary<string, GameObject> traits;

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

        traits = new SerializedDictionary<string, GameObject>();
    }

    public void UpdateTrait(JTrait jTrait, int currBreakpoint)
    {
        GameObject traitObj;
        if(traits.ContainsKey(jTrait.traitId))
        {
            traitObj = traits[jTrait.traitId];
            TraitInfo traitInfo = traitObj.GetComponent<TraitInfo>();
            traitInfo.UpdateCurrBreakpoint(currBreakpoint);
        }
        else
        {
            GameObject traitPath = Resources.Load<GameObject>("prefabs/fight/traits/TraitInfo");
            traitObj = Instantiate(traitPath, this.transform);
            TraitInfo traitInfo = traitObj.GetComponent<TraitInfo>();
            traitInfo.Info(jTrait, currBreakpoint);
            traits.Add(jTrait.traitId, traitObj);
        }
        if(currBreakpoint <= 0)
        {
            Destroy(traitObj);
            traits.Remove(jTrait.traitId);
        }
        List<GameObject> temp = traits.Values.OrderByDescending(x => x.GetComponent<TraitInfo>().breakpointActive).ThenByDescending(x => x.GetComponent<TraitInfo>().currBreakpoint).ToList();
        for(int i = 0; i < temp.Count; i++)
        {
            temp[i].transform.SetSiblingIndex(i);
        }
    }
}
