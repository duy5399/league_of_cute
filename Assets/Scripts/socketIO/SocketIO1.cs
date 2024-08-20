using BestHTTP.SocketIO3;
using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class SocketIO1 : MonoBehaviour
{
    public static SocketIO1 instance { get; private set; }
    public SocketManager socketManager { get; private set; }

    [SerializeField] private AccountIO _accountIO;
    [SerializeField] private ChatIO _chatIO;
    [SerializeField] private FriendIO _friendIO;
    [SerializeField] private LobbyIO _lobbyIO;
    [SerializeField] private RoomIO _roomIO;
    [SerializeField] private StoreIO _storeIO;
    [SerializeField] private UnitShopIO _unitShopIO;
    [SerializeField] private MoveIO _moveIO;
    [SerializeField] private TacticianStateIO _tacticianStateIO;
    [SerializeField] private TacticianAnimIO _tacticianAnimIO;
    [SerializeField] private TacticianMoveIO _tacticianMoveIO;
    [SerializeField] private UnitIO _unitIO;
    [SerializeField] private UnitStateIO _unitStateIO;
    [SerializeField] private UnitAnimIO _unitAnimIO;
    [SerializeField] private UnitMoveIO _unitMoveIO;
    [SerializeField] private UnitSkillIO _unitSkillIO;
    [SerializeField] private TraitIO _traitIO;
    [SerializeField] private ItemIO _itemIO;
    [SerializeField] private ScoreboardIO _scoreboardIO;

    public AccountIO accountIO
    {
        get { return _accountIO; }
    }

    public ChatIO chatIO
    {
        get { return _chatIO; }
    }

    public FriendIO friendIO
    {
        get { return _friendIO; }
    }

    public LobbyIO lobbyIO
    {
        get { return _lobbyIO; }
    }

    public RoomIO roomIO
    {
        get { return _roomIO; }
    }

    public StoreIO storeIO
    {
        get { return _storeIO; }
    }

    public UnitShopIO unitShopIO
    {
        get { return _unitShopIO; }
    }

    public MoveIO moveIO
    {
        get { return _moveIO; }
    }

    public TacticianStateIO tacticianStateIO
    {
        get { return _tacticianStateIO; }
    }

    public TacticianAnimIO tacticianAnimIO
    {
        get { return _tacticianAnimIO; }
    }

    public TacticianMoveIO tacticianMoveIO
    {
        get { return _tacticianMoveIO; }
    }

    public UnitIO unitIO
    {
        get { return _unitIO; }
    }

    public UnitStateIO unitStateIO
    {
        get { return _unitStateIO; }
    }

    public UnitAnimIO unitAnimIO
    {
        get { return _unitAnimIO; }
    }

    public UnitMoveIO unitMoveIO
    {
        get { return _unitMoveIO; }
    }

    public UnitSkillIO unitSkillIO
    {
        get { return _unitSkillIO; }
    }

    public TraitIO traitIO
    {
        get { return _traitIO; }
    }

    public ItemIO itemIO
    {
        get { return _itemIO; }
    }

    public ScoreboardIO scoreboardIO
    {
        get { return _scoreboardIO; }
    }

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
        _accountIO = this.gameObject.AddComponent<AccountIO>();
        _chatIO = this.gameObject.AddComponent<ChatIO>();
        _friendIO = this.gameObject.AddComponent<FriendIO>();
        _lobbyIO = this.gameObject.AddComponent<LobbyIO>();
        _roomIO = this.gameObject.AddComponent<RoomIO>();
        _storeIO = this.gameObject.AddComponent<StoreIO>();
        _unitShopIO = this.gameObject.AddComponent<UnitShopIO>();
        //_moveIO = this.gameObject.AddComponent<MoveIO>();
        _tacticianStateIO = this.gameObject.AddComponent<TacticianStateIO>();
        _tacticianAnimIO = this.gameObject.AddComponent<TacticianAnimIO>();
        _tacticianMoveIO = this.gameObject.AddComponent<TacticianMoveIO>();
        _unitIO = this.gameObject.AddComponent<UnitIO>();
        _unitStateIO = this.gameObject.AddComponent<UnitStateIO>();
        _unitAnimIO = this.gameObject.AddComponent<UnitAnimIO>();
        _unitMoveIO = this.gameObject.AddComponent<UnitMoveIO>();
        _unitSkillIO = this.gameObject.AddComponent<UnitSkillIO>();
        _traitIO = this.gameObject.AddComponent<TraitIO>();
        _itemIO = this.gameObject.AddComponent<ItemIO>();
        _scoreboardIO = this.gameObject.AddComponent<ScoreboardIO>();
    }

    void Start()
    {
        DontDestroyOnLoad(this.gameObject);
        SocketOptions options = new SocketOptions();
        options.Auth = (manager, socket) => new { token = "leagueofcute_duy123" };
        socketManager = new SocketManager(new Uri("http://localhost:3000"), options);
        socketManager.Socket.On("connection", () => Debug.Log(socketManager.Socket.Id));
    }
}
