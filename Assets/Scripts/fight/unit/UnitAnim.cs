using AYellowpaper.SerializedCollections;
using Mono.Unix.Native;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class UnitAnim : MonoBehaviour
{
    [SerializeField] protected Animator animator;
    [SerializeField] protected AnimStatus animStatus;
    [SerializeField] protected Transform skillEffect;
    public SerializedDictionary<string, GameObject> animSkillEffect;

    protected virtual void Awake()
    {
        animator = this.transform.GetComponentInChildren<Animator>();
        animStatus = AnimStatus.Idle;
        animSkillEffect = new SerializedDictionary<string, GameObject>();
        for (int i = 0; i < this.transform.childCount; i++)
        {
            if (this.transform.GetChild(i).tag == "SkillEffect")
            {
                skillEffect = this.transform.GetChild(i);
                break;
            }
        }
    }

    protected virtual void Start()
    {
        for(int i = 0; i < skillEffect.childCount; i++)
        {
            if (animSkillEffect.ContainsKey(skillEffect.GetChild(i).name))
            {
                continue;
            }
            animSkillEffect.Add(skillEffect.GetChild(i).name, skillEffect.GetChild(i).gameObject);
        }
    }

    public virtual void TriggerAnim(string animName, float animSpeed = 1f, bool force = false, List<AnimEffect> animEffect = null)
    {
        if (!animator || animName == "idle" && this.animStatus == AnimStatus.Idle || animName == "run" && this.animStatus == AnimStatus.Run || animName == "death" && this.animStatus == AnimStatus.Death)
        {
            return;
        }
        if (animName == "idle")
        {
            animStatus = AnimStatus.Idle;
            animator.ResetTrigger("run");
            animator.ResetTrigger("death");
            animator.ResetTrigger("victory");
            animator.ResetTrigger("sk_attack01");
            animator.ResetTrigger("sk_attack02");
        }
        else if (animName == "run")
        {
            animStatus = AnimStatus.Run;
            animator.ResetTrigger("idle");
            animator.ResetTrigger("death");
            animator.ResetTrigger("victory");
            animator.ResetTrigger("sk_attack01");
            animator.ResetTrigger("sk_attack02");
        }
        else if (animName == "death")
        {
            animStatus = AnimStatus.Death;
            animator.ResetTrigger("idle");
            animator.ResetTrigger("run");
            animator.ResetTrigger("death");
            animator.ResetTrigger("victory");
            animator.ResetTrigger("sk_attack01");
            animator.ResetTrigger("sk_attack02");
            WaitFor(1f, () =>
            {
                this.gameObject.SetActive(false);
            });
        }
        else if (animName == "force_std")
        {
            animStatus = AnimStatus.Idle;
            animator.ResetTrigger("idle");
            animator.ResetTrigger("run");
            animator.ResetTrigger("death");
            animator.ResetTrigger("victory");
            animator.ResetTrigger("sk_attack01");
            animator.ResetTrigger("sk_attack02");
            //InterruptNowAnim();
        }
        else
        {
            animStatus = AnimStatus.Other;
            //InterruptNowAnim();
        }
        animator.speed = animSpeed;
        if (force)
        {
            animator.Play(animName);
        }
        else
        {
            animator.SetTrigger(animName);
        }
        if (animEffect == null)
        {
            return;
        }
        for (int i = 0; i < animEffect.Count(); i++)
        {
            SpawnAnimEffect(animEffect[i]);
        }
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

    public void WaitFor(float delay, Action func)
    {
        if (func == null)
        {
            return;
        }
        if (delay <= 0.0001f)
        {
            func();
        }
        else
        {
            Coroutine coroutine = StartCoroutine(_WaitFor(delay, func));
        }
    }

    public IEnumerator _WaitFor(float delay, Action func)
    {
        yield return new WaitForSeconds(delay);
        func();
    }
}
