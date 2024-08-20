using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ScoreboardPlayerInfoManager : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI txtNickname;
    [SerializeField] private TextMeshProUGUI txtHP;
    [SerializeField] private Image imgHP;
    [SerializeField] private Image imgProfile;

    private void Awake()
    {
        txtNickname = this.transform.GetChild(0).GetComponent<TextMeshProUGUI>();
        txtHP = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        imgHP = this.transform.GetChild(2).GetComponent<Image>();
        imgProfile = this.transform.GetChild(3).GetComponent<Image>();
    }

    public void SetPlayerName(string playerName)
    {
        txtNickname.text = playerName;
    }

    public void SetHP(float hp, float maxhp)
    {
        txtHP.text = hp.ToString();
        imgHP.fillAmount = hp / maxhp;
        if(hp <= 0)
        {
            imgProfile.color = new Color32(100, 100, 100, 255);
        }
    }

    public void SetAvatar(string petId)
    {
        switch (petId)
        {
            case "petavatar":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_tftavatar_set7launchbattlepass_egg_tier1"); break;
            case "petbuglet":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_buglet_anniversary_variant1_tier1"); break;
            case "petchoncc":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_choncc_classic_tier3"); break;
            case "petghosty":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_ghosty_black_tier3"); break;
            case "petglion":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_grumpylion_dark_tier3"); break;
            case "pethushtail":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_spiritfox_mistberry_tier3"); break;
            case "petminigolem":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_minigolem_anniversary_variant1_tier1"); break;
            case "petpengu":
                imgProfile.sprite = Resources.Load<Sprite>("textures/tacticians/icon_penguknight_classic_tier3"); break;
        }
    }
}
