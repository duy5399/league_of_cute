using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class SkillDescription : MonoBehaviour
{
    public static SkillDescription instance { get; private set; }

    [SerializeField] private Transform tfUnitSkillInfo;
    [SerializeField] private Image imgUnitSkillIcon;
    [SerializeField] private TextMeshProUGUI txtUnitSkillName;
    [SerializeField] private TextMeshProUGUI txtUnitSkillDescription;

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
        tfUnitSkillInfo = this.transform.GetChild(0);
        imgUnitSkillIcon = tfUnitSkillInfo.GetChild(0).GetComponent<Image>();
        txtUnitSkillName = tfUnitSkillInfo.GetChild(1).GetChild(0).GetComponent<TextMeshProUGUI>();
        txtUnitSkillDescription = tfUnitSkillInfo.GetChild(1).GetChild(1).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        tfUnitSkillInfo.gameObject.SetActive(false);
    }

    public void DisplaySkillInfo(bool isActive, JUnitState jUnitState = null)
    {
        tfUnitSkillInfo.gameObject.SetActive(isActive);
        if (!isActive || jUnitState == null)
        {
            return;
        }
        imgUnitSkillIcon.sprite = Resources.Load<Sprite>("textures/heroSkill/" + jUnitState.ability.skillIcon);
        txtUnitSkillName.text = jUnitState.ability.skillName;
        txtUnitSkillDescription.text = jUnitState.ability.skillDescription;
    }
}
