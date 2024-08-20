using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class BuffInfo : MonoBehaviour
{
    public JBuff buff;
    public Image imgBuffIcon;
    public Image imgLifetime;
    public float lifetime;
    public TextMeshProUGUI txtLayer;

    public int currLayer;

    private void Awake()
    {
        imgBuffIcon = this.transform.GetChild(1).GetChild(0).GetComponent<Image>();
        imgLifetime = this.transform.GetChild(2).GetChild(0).GetComponent<Image>();
        txtLayer = this.transform.GetChild(3).GetComponent<TextMeshProUGUI>();
    }

    private void FixedUpdate()
    {
        if (lifetime <= 0)
        {
            return;
        }
        lifetime -= Time.fixedDeltaTime;
        imgLifetime.fillAmount = 1 - (lifetime / buff.buffDuration);
    }
}
