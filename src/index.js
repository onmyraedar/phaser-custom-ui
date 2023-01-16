import api, { route } from '@forge/api';
import Resolver from '@forge/resolver';

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

resolver.define("getRecentProjects", async ({ payload }) => {
  const params = new URLSearchParams(payload || {});

  params.append("maxResults", "5");
  params.append("orderBy", "lastIssueUpdatedTime");

  const requestURL = route`/rest/api/3/project/search?${params}`;

  console.log(requestURL);

  const res = await api.asApp().requestJira(requestURL, {
    headers: {
      ...jsonHeaders,
    },
  });

  const status = res
  const data = await res.json();

  return { status, data };
});

resolver.define("getIssuesByProject", async ({ payload }) => {
  const params = new URLSearchParams(payload || {});

  const requestURL = route`/rest/api/2/search?jql=${params}`;

  console.log(requestURL);

  const res = await api.asApp().requestJira(requestURL, {
    headers: {
      ...jsonHeaders,
    },
  });

  const status = res
  const data = await res.json();

  return { status, data };
});

export const handler = resolver.getDefinitions();