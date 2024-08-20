using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class HpIndicatorController : MonoBehaviour
{
    public static HpIndicatorController instance { get; private set; }

    [SerializeField] private List<GameObject> lstHpPlay;
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
    }

    private void OnEnable()
    {
        lstHpPlay = new List<GameObject>();
    }

    private void OnDisable()
    {
        lstHpPlay.Clear();
    }

    void Start()
    {

    }

    void Update()
    {

    }

    public void PlayHPChange(Vector3 position, string content, ColorStyle colorStyle)
    {
        try
        {
            GameObject hpPlayObj = lstHpPlay.FirstOrDefault(x => x.activeSelf == false);
            if (hpPlayObj)
            {
                hpPlayObj.SetActive(true);
                hpPlayObj.transform.position = position;
                FloatingText floatingText = hpPlayObj.GetComponent<FloatingText>();
                floatingText.ShowText(content, colorStyle);
            }
            else
            {
                GameObject newHpPlayObj = Instantiate(Resources.Load<GameObject>("prefabs/ui/FloatingText"), position, Quaternion.identity);
                newHpPlayObj.transform.parent = this.transform;
                newHpPlayObj.transform.position = position;
                FloatingText floatingText = newHpPlayObj.GetComponent<FloatingText>();
                floatingText.ShowText(content, colorStyle);
                lstHpPlay.Add(newHpPlayObj);
            }
        }
        catch
        {
            Debug.LogError("PlayHPChange error");
        }
    }
}
