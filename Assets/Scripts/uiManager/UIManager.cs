using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;

public class UIManager : MonoBehaviour
{
    public static UIManager instance { get; private set; }

    public GameObject panelWaiting;
    public LoadingScreenController loadingScreenController;
    //public HpIndicatorController hpIndicatorController;

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

        GameObject panelWaitingPath = Resources.Load<GameObject>("prefabs/ui/Panel_Waiting");
        panelWaiting = Instantiate(panelWaitingPath, this.transform);

        GameObject loadingScreenControllerPath = Resources.Load<GameObject>("prefabs/ui/Panel_LoadingScreen");
        loadingScreenController = Instantiate(loadingScreenControllerPath, this.transform).GetComponent<LoadingScreenController>();

        //GameObject hpIndicatorControllerPath = Resources.Load<GameObject>("prefabs/ui/Panel_HpIndicator");
        //hpIndicatorController = Instantiate(hpIndicatorControllerPath, this.transform).GetComponent<HpIndicatorController>();

        panelWaiting.SetActive(false);
        loadingScreenController.gameObject.SetActive(false);
    }
}
