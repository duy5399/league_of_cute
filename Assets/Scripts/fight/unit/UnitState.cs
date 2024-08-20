using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UnitState : MonoBehaviour
{
    public JUnitState jUnitState;
    public Transform weakness;

    private void Awake()
    {
        for (int i = 0; i < this.transform.childCount; i++)
        {
            if (this.transform.GetChild(i).tag == "Weakness")
            {
                weakness = this.transform.GetChild(i);
                break;
            }
        }
    }
}