# SKY UX SDK Builder Config

Configuration files for `@skyux-sdk/builder` when running on different platforms.

## Environment Configuration

**Travis-CI (environment variables)**

- `BROWSER_STACK_USERNAME`
- `BROWSER_STACK_ACCESS_KEY`
- `BROWSER_STACK_BUILD_ID`
- `BROWSER_STACK_PROJECT`

**VSTS (command-line arguments)**
- `--buildNumber "BUILD_NUMBER_HERE"`
- `--buildDefinitionName "DEF_NAME_HERE"`
- `--bsUser ********`
- `--bsKey ********`

**Visual Tests**

- `VISUAL_FAILURES_REPO_URL` A secure repo URL created by the SPA repo owners in this format: `https://{access_token}@github.com/{org_name}/{repo_name}.git`
- `VISUAL_BASELINES_REPO_URL` A secure repo URL created by the SPA repo owners in this format: `https://{access_token}@github.com/{org_name}/{repo_name}.git`

## Pipeline Settings

- Test settings (specified as `testSettings` in `skyuxconfig.json`) can be customized for each pipeline. The `testSettings` config serves as the default, but can be overridden by the `pipelineSettings` as demonstrated below.
- Setting `browserSet` to `false` will inform the pipeline to use the local Chrome driver installed on the pipeline's image.
```
{
  // Defaults:
  "testSettings": {
    "e2e": {
      "browserSet": "speedy"
    },
    "unit": {
      "browserSet": "paranoid"
    }
  },

  // Pipeline overrides:
  "pipelineSettings": {
    "gh-actions": {
      "testSettings": {
        "e2e": {
          "browserSet": "speedy"
        },
        "unit": {
          "browserSet": "paranoid"
        }
      }
    },
    "travis": {
      "testSettings": {
        "e2e": {
          "browserSet": "speedy"
        },
        "unit": {
          "browserSet": "paranoid"
        }
      }
    },

    // Don't run BrowserStack on ADO ("vsts", formerly known as Visual Studio Team Services):
    "vsts": {
      "testSettings": {
        "e2e": {
          "browserSet": false
        },
        "unit": {
          "browserSet": false
        }
      }
    }
  }
}
```