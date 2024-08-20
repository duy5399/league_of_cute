using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ItemBase1 : MonoBehaviour
{
    public JItemBase jItemBase;
    public bool picked;

    private void Awake()
    {
        picked = false;
    }
}

