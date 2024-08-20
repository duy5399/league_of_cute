using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AccountManager : MonoBehaviour
{
    public static AccountManager instance { get; private set; }

    public LoginController loginController;
    public RegisterController registerController;
    public ForgotPasswordController forgotPasswordController;
    public CreateCharacterController createCharacterController;

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

        //GameObject mainCameraPath = Resources.Load<GameObject>("prefab/camera/Main Camera");
        //mainCamera = Instantiate(mainCameraPath);

        GameObject loginControllerPath = Resources.Load<GameObject>("prefabs/account/LoginForm");
        loginController = Instantiate(loginControllerPath, this.transform).GetComponent<LoginController>();

        GameObject registerControllerPath = Resources.Load<GameObject>("prefabs/account/RegisterForm");
        registerController = Instantiate(registerControllerPath, this.transform).GetComponent<RegisterController>();

        GameObject forgotPasswordControllerPath = Resources.Load<GameObject>("prefabs/account/ForgotPasswordForm");
        forgotPasswordController = Instantiate(forgotPasswordControllerPath, this.transform).GetComponent<ForgotPasswordController>();

        GameObject createCharacterControllerPath = Resources.Load<GameObject>("prefabs/account/CreateCharacterForm");
        createCharacterController = Instantiate(createCharacterControllerPath, this.transform).GetComponent<CreateCharacterController>();

        registerController.gameObject.SetActive(false);
        forgotPasswordController.gameObject.SetActive(false);
        createCharacterController.gameObject.SetActive(false);
    }
}
