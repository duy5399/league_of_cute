using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class DetectItemDescription : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public JItemBase jItemBase;

    private void Awake()
    {

    }

    private void OnEnable()
    {
        jItemBase = null;
    }

    private void OnDisable()
    {
        jItemBase = null;
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        if (jItemBase == null)
        {
            return;
        }
        ItemDescription.instance.DisplayItemInfo(true, jItemBase.itemInfo);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        if (jItemBase == null)
        {
            return;
        }
        ItemDescription.instance.DisplayItemInfo(true, jItemBase.itemInfo);
    }
}