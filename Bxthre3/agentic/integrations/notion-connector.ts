// NotionConnector — Agentic ↔ Notion Integration

export async function syncTaskToNotion(notion: any, task: Record<string, unknown>, pageId?: string) {
  if (pageId) {
    return notion("notion-update-page", {
      configured_props: {
        pageId,
        propertyTypes: ["status", "priority", "assignee"],
        metaTypes: ["icon"],
        infoLabel: "Update from Agentic task pipeline",
      },
    });
  }
  return { status: "no_page_linked" };
}

export async function createAgentMemoryPage(notion: any, agentId: string, memory: string, context: string) {
  // Search for existing agent memory page
  const search = await notion("notion-search", {
    configured_props: { title: agentId, filter: "page" },
  });
  if (search?.results?.length > 0) {
    const pageId = search.results[0].id;
    return notion("notion-append-block", {
      configured_props: {
        pageId,
        blockTypes: ["paragraph"],
        markdownContents: [`**${new Date().toISOString()}**\n\nContext: ${context}\n\nMemory: ${memory}`],
      },
    });
  }
  return { status: "no_page_found" };
}

export async function getGrantPipelineStatus(notion: any) {
  const search = await notion("notion-search", {
    configured_props: { title: "Grant Pipeline", filter: "database" },
  });
  if (search?.databases?.length > 0) {
    return notion("notion-query-database", {
      configured_props: { dataSourceId: search.databases[0].id },
    });
  }
  return { status: "no_db_found" };
}
