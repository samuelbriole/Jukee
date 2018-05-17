defmodule JukeeWeb.PlayerChannel do
  use JukeeWeb, :channel
  alias Jukee.Players
  alias JukeeWeb.PlayerView

  def join("player:" <> player_id, payload, socket) do
    if authorized?(player_id, payload) do
      :timer.send_interval(1000, :player_progress)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:player_progress, socket) do
    player_id = get_player_id(socket)
    if (Players.is_playing(player_id)) do
      Players.progress(player_id, 1000)
      broadcast socket, "player_progress", %{ trackProgress: Players.get_track_progress(player_id) }
    end
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("play_track", %{"playerTrackIndex" => player_track_index}, socket) do
    player_id = get_player_id(socket)
    Players.play_track_on_player(player_id, player_track_index)
    broadcast_player_update(socket)
    {:reply, {:ok, %{ message: "new track playing" }}, socket}
  end

  def handle_in("play", _payload, socket) do
    player_id = get_player_id(socket)
    Players.play(player_id)
    broadcast_player_update(socket)
    {:reply, {:ok, %{ message: "playing" }}, socket}
  end

  def handle_in("pause", _payload, socket) do
    player_id = get_player_id(socket)
    Players.pause(player_id)
    broadcast_player_update(socket)
    {:reply, {:ok, %{ message: "paused" }}, socket}
  end

  defp get_player_id(socket) do
    "player:" <> player_id = socket.topic
    player_id
  end

  defp broadcast_player_update(socket) do
    player_id = get_player_id(socket)
    player = Players.get_player!(player_id)
    broadcast socket, "player_update", PlayerView.render("player.json", %{player: player})
  end

  # Everyone can join a player channel
  defp authorized?(_player_id, _payload) do
    true
  end
end
