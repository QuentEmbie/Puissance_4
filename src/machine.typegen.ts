// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    add_player: "ADD_PLAYER";
    play: "PLAY_MOVE";
    play_winning_move: "PLAY_MOVE";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    are_two_players: "START";
    column_valid: "PLAY_MOVE";
    is_winning_move: "PLAY_MOVE";
    less_or_equal_to_two_players: "ADD_PLAYER";
  };
  eventsCausingServices: {};
  matchesStates: "END" | "PLAY" | "WAITING";
  tags: never;
}
