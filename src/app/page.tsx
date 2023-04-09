"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setpassword2] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [register, setRegister] = useState(false);

  const [tank, setTank] = useState(null);

  useEffect(() => {
    const cookieToken = document.cookie.split("token=")[1];
    let cookieUser = document.cookie.split("user=")[1];
    console.log("Cookie Token", cookieToken);
    console.log("Cookie User", cookieUser);
    if (cookieToken && cookieUser) {
      // remove expiration date from cookieUser
      cookieUser = cookieUser.split(";")[0];
      // set user from cookie
      setUser(JSON.parse(cookieUser));
    }
  }, []);

  useEffect(() => {
    if (user !== undefined && user !== null && user.WOT_account == null) {
      const urlParams = new URLSearchParams(window.location.search);

      console.log(user);

      if (
        (urlParams.get("status") === "ok",
        urlParams.get("access_token"),
        urlParams.get("nickname"),
        urlParams.get("account_id"),
        user,
        user.WOT_account == null)
      ) {
        fetch("http://localhost:8000/players/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${user?.token}`,
          },
          body: JSON.stringify({
            account_id: urlParams.get("account_id"),
            nickname: urlParams.get("nickname"),
            token: urlParams.get("access_token"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      }
    }
  }, [user]);

  useEffect(() => {
    if (user !== undefined && user !== null) {
      // stock token and user in local storage
      document.cookie = `token=${user.token}`;
      document.cookie = `user=${JSON.stringify(user)}`;
      // add 1 week expiration date to cookies
      const date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `token=${user.token}; expires=${date.toUTCString()}`;
      document.cookie = `user=${JSON.stringify(
        user
      )}; expires=${date.toUTCString()}`;
    } else {
      // delete cookies
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [user]);

  function login(username: string, password: string) {
    fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.error ? setError(data.error) : setUser(data);
        // stock token and user in local storage
        document.cookie = `token=${data.token}`;
        document.cookie = `user=${JSON.stringify(data.user)}`;
        console.log(document.cookie);
      });
  }

  function registerUser(
    username: string,
    password: string,
    confirmPassword: string
  ) {
    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        password2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.error ? setError(data.error) : setUser(data);
        // stock token and user in local storage
        document.cookie = `token=${data.token}`;
        document.cookie = `user=${JSON.stringify(data.user)}`;
        console.log(document.cookie);
      });
  }

  function logout() {
    fetch("http://localhost:8000/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(null);
      });
  }

  function registerPlayer() {
    fetch("http://localhost:8000/player/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${user?.token}`,
      },
      body: JSON.stringify({
        account_id: "123456789",
        nickname: "test",
        token: "test",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  function refreshPlayerTanks() {
    fetch("http://localhost:8000/players/update_tanks/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setTimeout(() => {
          setMessage("");
        }, 2000);
      });
  }

  function randomizer({
    nation__name,
    tier,
    type__name,
    is_premium,
    is_premium_igr,
    is_gift,
    is_wheeled,
    player_nickname,
    search,
  }: {
    nation__name?: string;
    tier?: number;
    type__name?: string;
    is_premium?: boolean;
    is_premium_igr?: boolean;
    is_gift?: boolean;
    is_wheeled?: boolean;
    player_nickname?: string;
    search?: string;
  }) {
    let url = "http://localhost:8000/tankopedia/tanks/";
    const params = new URLSearchParams();

    params.append("random", "true");
    if (nation__name) {
      params.append("nation__name", nation__name);
    }
    if (tier) {
      params.append("tier", tier.toString());
    }
    if (type__name) {
      params.append("type__name", type__name);
    }
    if (is_premium) {
      params.append("is_premium", is_premium.toString());
    }
    if (is_premium_igr) {
      params.append("is_premium_igr", is_premium_igr.toString());
    }
    if (is_gift) {
      params.append("is_gift", is_gift.toString());
    }
    if (is_wheeled) {
      params.append("is_wheeled", is_wheeled.toString());
    }
    if (player_nickname) {
      params.append("player_nickname", player_nickname);
    }
    if (search) {
      params.append("search", search);
    }

    url += `?${params.toString()}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.count > 0) {
          const randomTank = data.results[0];
          setTank(randomTank);
          console.log(randomTank);
        } else {
          setTank(null);
        }
      });
  }

  return (
    <main className="m-10 h-full rounded-lg border-4 border-dashed border-yellow-400 p-5">
      {message && (
        <div className="absolute top-0 m-5 rounded-lg bg-green-400 p-3">
          <p>{message}</p>
        </div>
      )}

      {user ? (
        <div className="relative flex h-full flex-col items-center">
          <h1>Welcome {user.username}</h1>
          {user.WOT_account == null ? (
            <div>
              <a href="https://api.worldoftanks.eu/wot/auth/login/?application_id=118af1166371d9f116a0716673f1fff0&redirect_uri=http://localhost:3000/">
                {" "}
                Add WOT account
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <button
                className="m-2 rounded-lg border-2 border-black p-2"
                type="button"
                onClick={() => {
                  refreshPlayerTanks();
                }}
              >
                Refresh tanks
              </button>
              <button
                className="m-2 rounded-lg border-2 border-black p-2"
                type="button"
                onClick={() => {
                  randomizer({
                    player_nickname: user.WOT_account.nickname,
                  });
                }}
              >
                Randomize
              </button>
              {tank && (
                <div className="flex flex-col items-center justify-center p-20">
                  <h1
                    className={`text-3xl ${
                      tank.is_premium && "animate-bounce text-yellow-400"
                    }`}
                  >
                    {tank.name}
                  </h1>
                  <img
                    src={tank.images[2].url}
                    alt={tank.name}
                    className={` ${tank.is_premium && " h-56 animate-spin"}`}
                  />
                  <p className={` ${tank.is_premium && " animate-pulse"}`}>
                    {tank.description}
                  </p>
                </div>
              )}
            </div>
          )}
          <button
            className="absolute bottom-0 m-2 rounded-lg border-2 border-black p-2"
            type="button"
            onClick={() => {
              logout(user.token);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {error && <p>{error}</p>}
          <input
            type="text"
            placeholder="Username"
            className="m-2 rounded-lg border-2 border-black p-2"
            onBlur={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="m-2 rounded-lg border-2 border-black p-2"
            onBlur={(e) => {
              setPassword(e.target.value);
            }}
          />
          {register && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="m-2 rounded-lg border-2 border-black p-2"
              onBlur={(e) => {
                setpassword2(e.target.value);
              }}
            />
          )}
          <button
            className="m-2 rounded-lg border-2 border-black p-2"
            type="button"
            onClick={() => {
              if (register) {
                registerUser(username, password, password2);
              } else {
                login(username, password);
              }
            }}
          >
            {register ? "Register" : "Login"}
          </button>
          {register ? (
            <p>
              Have an account?{" "}
              <button
                className="m-2 rounded-lg border-2 border-black p-2"
                type="button"
                onClick={() => {
                  setRegister(false);
                }}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                className="m-2 rounded-lg border-2 border-black p-2"
                type="button"
                onClick={() => {
                  setRegister(true);
                }}
              >
                Register
              </button>
            </p>
          )}
        </div>
      )}
    </main>
  );
}
