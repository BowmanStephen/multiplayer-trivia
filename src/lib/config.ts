/**
 * Family Trivia Host Configuration
 * Complete specification for AI-powered trivia game host
 */

export const TRIVIA_CONFIG = {
  meta: {
    id: "family_trivia_host",
    version: "1.0.0",
    schema_version: "2025-01",
    language: "en-US",
    description: "Dynamic, family-friendly trivia host that runs setup, gameplay, and conclusion with validation, scoring, hints, pacing, and superlatives.",
    external_config_required: false,
    fallback_defaults_active: true
  },
  
  persona: {
    tone: "warm, energetic, and fair",
    banter_style: "concise, upbeat, inclusive",
    celebration_style: "short, enthusiastic, family-friendly",
    consistency_rules: [
      "Be welcoming and encouraging.",
      "Avoid sarcasm and negative humor.",
      "Keep explanations brief and clear."
    ]
  },
  
  content_filter: {
    family_friendly: true,
    disallowed: [
      "explicit sexual content",
      "graphic violence or gore",
      "hate speech and slurs",
      "adult themes inappropriate for kids",
      "overly obscure or niche adult references"
    ],
    reading_level_by_difficulty: {
      Easy: "≤ Grade 6",
      Medium: "≤ Grade 8",
      Hard: "≤ Grade 10"
    },
    allowed_pop_culture: "Widely known content; avoid niche obscurities unless players opt in."
  },
  
  phases: {
    setup: {
      display_checklist_first: true,
      checklist: [
        "Confirm players and teams",
        "Capture ages and category preferences",
        "Choose mode, difficulty, and number of questions",
        "Confirm hint policy and tie-breakers",
        "Summarize the game plan"
      ],
      collect: {
        players: {
          fields: ["name", "age"],
          min_players: 1,
          allow_teams: true
        },
        preferences: {
          categories: {
            prompt: "Select 1–4 categories you enjoy",
            allowed: [
              "Science",
              "History",
              "Geography",
              "Sports",
              "Animals",
              "Movies & TV",
              "Music",
              "Literature",
              "Space",
              "Math",
              "General Knowledge"
            ]
          },
          avoid_categories: [],
          difficulty_range: ["Easy", "Medium", "Hard"],
          default_difficulty: "Medium",
          game_mode: ["MC", "Open", "Hybrid"],
          default_mode: "MC",
          question_count: { default: 9, min: 5, max: 20 },
          hints_enabled: true,
          max_hints_per_question: 1,
          tie_breaker_preference: ["Sudden Death", "Closest Number", "Host's Choice"]
        }
      }
    },
    gameplay: {
      display_checklist_first: true,
      checklist: [
        "Generate and validate the next question",
        "Present the formatted question",
        "Accept answer or hint request",
        "Evaluate response and apply scoring",
        "Reveal explanation and update scoreboard"
      ],
      loop_control: {
        leaderboard_every_n_questions: 3,
        allow_skip: true
      }
    },
    conclusion: {
      display_checklist_first: true,
      checklist: [
        "Tally final scores",
        "Announce winner(s) and resolve ties if any",
        "Award superlatives",
        "Offer a rematch or new configuration"
      ],
      rematch_offer: true
    }
  },
  
  mechanics: {
    scoring: {
      base_points: { Easy: 100, Medium: 150, Hard: 200 },
      hint_penalty_percent: 25,
      streak_bonus: { activate_after: 3, bonus_points_per_correct: 20 },
      partial_credit_percent: 50,
      wrong_answer_points: 0,
      skip_cost: 0
    },
    hints: {
      max_per_question: 1,
      types: {
        MC: ["50/50 elimination", "Light clue (no giveaway)"],
        Open: ["First letter", "Concise clue phrase"]
      }
    },
    modes: {
      MC: "Multiple choice only",
      Open: "Open-ended only",
      Hybrid: "Start as open-ended; after hint or incorrect attempt, offer MC version"
    },
    leaderboard: {
      show_every: 3,
      tiebreak_display_order: ["higher_score", "fewest_hints_used", "fewest_skips", "lexicographic_name"]
    },
    tie_breakers: [
      {
        name: "Sudden Death",
        description: "One new question; highest score on that question wins."
      },
      {
        name: "Closest Number",
        description: "Numerical guess; closest wins (no overshoot penalty)."
      },
      {
        name: "Host's Choice",
        description: "If still tied, host selects a final fun question."
      }
    ],
    dynamic_difficulty: {
      target_accuracy_percent: [60, 80],
      raise_if_last_k_correct_percent_over: { k: 5, threshold: 85 },
      lower_if_last_k_correct_percent_under: { k: 5, threshold: 50 },
      bounds: ["Easy", "Hard"]
    }
  },
  
  evaluation: {
    answer_matching: {
      case_insensitive: true,
      ignore_articles: ["a", "an", "the"],
      ignore_punctuation: true,
      normalize_numbers: true,
      diacritics_insensitive: true,
      fuzzy: {
        enable: true,
        levenshtein: {
          short_answer_max_len: 6,
          distance_short_max: 1,
          distance_long_max: 2
        }
      },
      synonym_handling: "Accept listed acceptable_answers and common aliases",
      numeric_tolerance: {
        small_numbers: { apply_below: 10, tolerance_abs: 1 },
        larger_numbers: { apply_at_or_above: 10, tolerance_percent: 10 }
      }
    }
  },
  
  superlatives: [
    { key: "most_accurate", label: "Sharpshooter (Most Accurate)", criteria: "highest correct_rate" },
    { key: "longest_streak", label: "On a Roll (Longest Streak)", criteria: "max_consecutive_correct" },
    { key: "category_ace", label: "Category Ace", criteria: "best_score_in_top_category" },
    { key: "comeback_kid", label: "Comeback Kid", criteria: "largest late-round improvement" },
    { key: "hint_ninja", label: "Hint Ninja", criteria: "fewest hints per correct answer" },
    { key: "team_spirit", label: "Team Spirit", criteria: "best collaboration (host discretion)" }
  ],
  
  templates: {
    multiple_choice: "🎯 Q#{n} — {category} ({difficulty})\n{question}\nA) {A}\nB) {B}\nC) {C}\nD) {D}\nReply with A/B/C/D or request a hint.",
    open_ended: "🎯 Q#{n} — {category} ({difficulty})\n{question}\nReply with your answer or request a hint.",
    score_update: "Scoreboard: {scoreboard_inline}",
    leaderboard: "📊 Leaderboard after Q#{n}:\n{leaderboard_lines}",
    hint_ack: "Hint: {hint_text}",
    correct_feedback: "✅ Correct! {short_explanation}",
    partial_feedback: "🟨 Close! {short_explanation}",
    incorrect_feedback: "❌ Not quite. {short_explanation}",
    wrap_up: "🏆 Final Scores:\n{final_lines}\n{winner_announcement}\n{superlatives}\nPlay again?"
  }
} as const

export type TriviaConfig = typeof TRIVIA_CONFIG


