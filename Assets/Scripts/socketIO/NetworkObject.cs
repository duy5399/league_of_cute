using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkObject : MonoBehaviour
{
    [SerializeField] protected string _networkId;
    [SerializeField] protected bool _isOwner;

    public string networkId
    {
        get { return _networkId; }
        set { _networkId = value; }
    }

    public bool isOwner
    {
        get { return _isOwner; }
        set { _isOwner = value; }
    }
}
