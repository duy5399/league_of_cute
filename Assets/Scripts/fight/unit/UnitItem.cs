using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UnitItem : MonoBehaviour
{
    public Transform itemManager;
    public List<GameObject> itemDisplay;
    public List<GameObject> itemObj;

    private void Awake()
    {
        for (int i = 0; i < this.transform.childCount; i++)
        {
            if (this.transform.GetChild(i).name == "ItemManager")
            {
                itemManager = this.transform.GetChild(i);
                break;
            }
        }
        itemDisplay = new List<GameObject>();
        itemDisplay.Add(itemManager.GetChild(0).gameObject);
        itemDisplay.Add(itemManager.GetChild(1).gameObject);
        itemDisplay.Add(itemManager.GetChild(2).gameObject);
        itemObj = new List<GameObject>();
    }

    protected virtual void Update()
    {
        itemManager.transform.LookAt(new Vector3(Camera.main.transform.position.x + this.transform.position.x, Camera.main.transform.position.y, Camera.main.transform.position.z));
    }

    public void AddEquip(JItemBase jItemBase)
    {
        for(int i = 0; i < itemDisplay.Count; i++)
        {
            if (itemDisplay[i].activeSelf)
            {
                continue;
            }
            itemDisplay[i].GetComponent<Image>().sprite = Resources.Load<Sprite>("textures/items/" + jItemBase.itemInfo.itemIcon);
            itemDisplay[i].SetActive(true);
            break;
        }
    }


}
