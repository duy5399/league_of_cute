using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class DetectSkillDescription : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public JUnitState jUnitState;

    private void Awake()
    {
        
    }

    private void OnEnable()
    {
        jUnitState = null;
    }

    private void OnDisable()
    {
        jUnitState = null;
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        if(jUnitState == null || jUnitState.ability == null)
        {
            return;
        }
        SkillDescription.instance.DisplaySkillInfo(true, jUnitState);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        if (jUnitState == null || jUnitState.ability == null)
        {
            return;
        }
        SkillDescription.instance.DisplaySkillInfo(false);
    }
}
