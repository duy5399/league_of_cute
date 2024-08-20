using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimManager2 : MonoBehaviour
{
    [SerializeField] protected Animator _animator;
    [SerializeField] protected AnimStatus status;

    public Animator animator
    {
        get { return _animator; }
        set { _animator = value; }
    }

    protected virtual void Awake()
    {
        animator = this.GetComponentInChildren<Animator>();
    }

    public virtual void TriggerAnim(string animName, float animSpeed = 1f, bool force = false, List<AnimEffect> animEffects = null)
    {

    }

    public virtual void TriggerEffect(string effectName)
    {

    }

    public virtual void SpawnAnimEffect(AnimEffect animEffect)
    {

    }

    public virtual void SpawnAnimAudio(string audio)
    {

    }
}

public enum AnimStatus
{
    Idle,
    Run,
    Death,
    Other
}

[Serializable]
public class AnimEffect
{
    public string effectName;
    public string effectPath;
    public float delay;
    public float[] offset;
    public float lifeTime;
    public bool followHero;
    public bool scaleAnimSpeed;
    public float animSpeed;
}
