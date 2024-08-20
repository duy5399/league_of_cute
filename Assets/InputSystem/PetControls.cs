//------------------------------------------------------------------------------
// <auto-generated>
//     This code was auto-generated by com.unity.inputsystem:InputActionCodeGenerator
//     version 1.7.0
//     from Assets/InputSystem/PetControls.inputactions
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.Utilities;

public partial class @PetControls: IInputActionCollection2, IDisposable
{
    public InputActionAsset asset { get; }
    public @PetControls()
    {
        asset = InputActionAsset.FromJson(@"{
    ""name"": ""PetControls"",
    ""maps"": [
        {
            ""name"": ""Pet"",
            ""id"": ""b379d7d7-819d-4076-81b5-30dd733ee510"",
            ""actions"": [
                {
                    ""name"": ""Move"",
                    ""type"": ""Button"",
                    ""id"": ""cc63fd4f-89ff-41ed-baa5-d5ced89a086e"",
                    ""expectedControlType"": ""Button"",
                    ""processors"": """",
                    ""interactions"": """",
                    ""initialStateCheck"": false
                }
            ],
            ""bindings"": [
                {
                    ""name"": """",
                    ""id"": ""db5784d6-b14d-440f-a1c6-f3535cb46977"",
                    ""path"": ""<Mouse>/rightButton"",
                    ""interactions"": """",
                    ""processors"": """",
                    ""groups"": """",
                    ""action"": ""Move"",
                    ""isComposite"": false,
                    ""isPartOfComposite"": false
                }
            ]
        }
    ],
    ""controlSchemes"": []
}");
        // Pet
        m_Pet = asset.FindActionMap("Pet", throwIfNotFound: true);
        m_Pet_Move = m_Pet.FindAction("Move", throwIfNotFound: true);
    }

    public void Dispose()
    {
        UnityEngine.Object.Destroy(asset);
    }

    public InputBinding? bindingMask
    {
        get => asset.bindingMask;
        set => asset.bindingMask = value;
    }

    public ReadOnlyArray<InputDevice>? devices
    {
        get => asset.devices;
        set => asset.devices = value;
    }

    public ReadOnlyArray<InputControlScheme> controlSchemes => asset.controlSchemes;

    public bool Contains(InputAction action)
    {
        return asset.Contains(action);
    }

    public IEnumerator<InputAction> GetEnumerator()
    {
        return asset.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public void Enable()
    {
        asset.Enable();
    }

    public void Disable()
    {
        asset.Disable();
    }

    public IEnumerable<InputBinding> bindings => asset.bindings;

    public InputAction FindAction(string actionNameOrId, bool throwIfNotFound = false)
    {
        return asset.FindAction(actionNameOrId, throwIfNotFound);
    }

    public int FindBinding(InputBinding bindingMask, out InputAction action)
    {
        return asset.FindBinding(bindingMask, out action);
    }

    // Pet
    private readonly InputActionMap m_Pet;
    private List<IPetActions> m_PetActionsCallbackInterfaces = new List<IPetActions>();
    private readonly InputAction m_Pet_Move;
    public struct PetActions
    {
        private @PetControls m_Wrapper;
        public PetActions(@PetControls wrapper) { m_Wrapper = wrapper; }
        public InputAction @Move => m_Wrapper.m_Pet_Move;
        public InputActionMap Get() { return m_Wrapper.m_Pet; }
        public void Enable() { Get().Enable(); }
        public void Disable() { Get().Disable(); }
        public bool enabled => Get().enabled;
        public static implicit operator InputActionMap(PetActions set) { return set.Get(); }
        public void AddCallbacks(IPetActions instance)
        {
            if (instance == null || m_Wrapper.m_PetActionsCallbackInterfaces.Contains(instance)) return;
            m_Wrapper.m_PetActionsCallbackInterfaces.Add(instance);
            @Move.started += instance.OnMove;
            @Move.performed += instance.OnMove;
            @Move.canceled += instance.OnMove;
        }

        private void UnregisterCallbacks(IPetActions instance)
        {
            @Move.started -= instance.OnMove;
            @Move.performed -= instance.OnMove;
            @Move.canceled -= instance.OnMove;
        }

        public void RemoveCallbacks(IPetActions instance)
        {
            if (m_Wrapper.m_PetActionsCallbackInterfaces.Remove(instance))
                UnregisterCallbacks(instance);
        }

        public void SetCallbacks(IPetActions instance)
        {
            foreach (var item in m_Wrapper.m_PetActionsCallbackInterfaces)
                UnregisterCallbacks(item);
            m_Wrapper.m_PetActionsCallbackInterfaces.Clear();
            AddCallbacks(instance);
        }
    }
    public PetActions @Pet => new PetActions(this);
    public interface IPetActions
    {
        void OnMove(InputAction.CallbackContext context);
    }
}
