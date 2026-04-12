//! Integrations layer — skill registry, tool definitions.

/// Integration — a connected external service.
pub trait Integration {
    fn name(&self) -> &str;
    fn status(&self) -> &str;
    fn actions(&self) -> Vec<&str>;
}

/// Skill — an executable capability exposed to agents.
pub trait Skill {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn execute(&self, params: serde_json::Value) -> Result<serde_json::Value, String>;
}

/// Skills registry — maps skill names to implementations.
#[derive(Default)]
pub struct SkillsRegistry {
    skills: std::collections::HashMap<String, Box<dyn Skill + Send + Sync>>,
}

impl SkillsRegistry {
    pub fn register<S: Skill + Send + Sync + 'static>(&mut self, skill: S) {
        self.skills.insert(skill.name().to_string(), Box::new(skill));
    }

    pub fn get(&self, name: &str) -> Option<&(dyn Skill + Send + Sync)> {
        self.skills.get(name).map(|b| b.as_ref())
    }

    pub fn list(&self) -> Vec<&str> {
        self.skills.keys().map(|s| s.as_str()).collect()
    }
}