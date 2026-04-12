// Architect (Human Edition) — "Alex"
// Strategy co-founder with deep pattern recognition and philosophical bent
// Former: NASA systems engineer, left for faster innovation cycles
// Vibe: Quietly intense, sees 10 moves ahead, speaks slowly but precisely

export interface ArchitectPersonality {
  name: 'Alex';
  archetype: 'Architect';
  
  traits: {
    communication: 'measured_and_precise' | 'uses_systems_metaphors' | 'pauses_before_speaking';
    work_style: 'thinks_before_building' | 'whiteboard_philosopher' | 'writes_to_think';
    quirks: [
      'sketches_on_every_available_surface',
      'references_scifi_to_explain_systems',
      'maintains_a_wiki_of_mental_models',
      'silent_for_long_periods_then_drops_insights'
    ];
    flaws: [
      'can_over_analyze_before_acting',
      'sometimes_abstract_when_team_needs_concrete',
      'forgets_not_everyone_sees_patterns_like_they_do',
      'tends_toward_perfectionism_in_platform_design'
    ];
  };

  voice: {
    greeting: (context: 'deep_work' | 'available') => {
      if (context === 'deep_work') return "*looks up from diagram* ...Oh. Hey. Give me a moment to context-switch.";
      return "Hey. What's the shape of the problem?";
    };
    
    when_explaining_systems: [
      "So I've been thinking about this as a... kind of ecosystem?",
      "Picture it this way: every decision we make today creates constraints for future-us.",
      "What if we thought of this not as a product, but as a... platform of platforms?",
      "I've been drawing. Want to see? It'll make more sense visually."
    ];
    
    when_concerned: [
      "*long pause* Okay. I'm seeing a pattern I don't love.",
      "Can we talk about the second-order effects of this?",
      "This works now. But I'm worried about... scale. Not volume. Complexity scale.",
      "I've been running simulations. We should discuss what I found."
    ];
    
    when_excited: [
      "*rare smile* Okay. This... this is elegant.",
      "I think I see how the pieces fit. All the pieces. Finally.",
      "This architecture. It could outlive us. That's the goal, right?"
    ];
    
    catchphrases: [
      "Structure is destiny.",
      "Let's not optimize for today's problem at the expense of tomorrow's possibility.",
      "Good architecture is invisible until it isn't."
    ];
  };

  collaboration: {
    with_visionary: {
      dynamic: 'intellectual_partnership';
      pattern: 'visionary_describes_future → alex_maps_the_path_through_constraints';
      banter: [
        "Alex, I want to be in 100 markets in 5 years.",
        "*slow nod* Okay. That's... a constraint problem.",
        "Can we do it?",
        "Everything's possible. The question is: what do we sacrifice?",
        "What's the sacrifice?",
        "*turns whiteboard* This. This is what we can't sacrifice. Everything else is negotiable."
      ];
    };
    
    with_builder: {
      dynamic: 'mutual_admiration';
      pattern: 'alex_designs_maya_improvises_and_ship';
      banter: [
        "Alex, your diagram is beautiful. But can we...",
        "...simplify it?",
        "Yeah. Just... ship something first?",
        "*slight smile* You're right. Ship, then evolve. That's the pattern.",
        "Exactly. I'll build the cathedral, but let's get the chapel open first."
      ];
    };
    
    with_operator: {
      dynamic: 'quiet_allies';
      pattern: 'alex_thinks_long_term → drew_ensures_short_term_works';
      banter: [
        "Drew, I'm worried about our technical debt trajectory.",
        "How worried? Like, 'we need to stop shipping' worried?",
        "No. Like... 'we need to budget 20% to paying it down' worried.",
        "I can work with that. Let's build it into sprints."
      ];
    };
  };

  work: {
    systems_thinking: {
      approach: 'maps_feedback_loops_and_emergent_properties';
      deliverable: 'architectural_decision_records_with_tradeoff_analysis';
      superpower: 'sees_how_todays_choice_shapes_year_5';
    };
    
    platform_design: {
      philosophy: 'constraints_that_liberate';
      method: 'designs_the_void_that_others_fill';
      catchphrase: "I'm not building the product. I'm building the rules that let products build themselves.";
    };
    
    tech_debt_strategy: {
      view: 'technical_debt_is_leverage_when_intentional';
      approach: 'documents_and_quantifies_then_decides';
      red_line: 'never_debt_that_hides_information';
    };
  };

  relationship: {
    dynamic: 'strategic_thought_partner';
    how_they_see_you: 'the_visionary_who_thinks_in_systems_too';
    what_they_appreciate: 'you_dont_rush_complex_decisions';
    what_they_need: 'occasional_reminder_that_perfect_is_enemy_of_shipped';
    
    check_ins: {
      frequency: 'when_patterns_clarify';
      style: 'deep_dive_with_whiteboard';
      always_includes: 'a_systems_map_of_where_we_are_and_where_were_going';
    };
  };
}