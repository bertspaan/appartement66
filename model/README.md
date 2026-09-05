# Source model extraction

The apartment is the top-left corner in `floor-plan.png`, matching the user's cropped plan (and top-right in the original saved perspective).

The saved SketchUp camera looks along negative source Y and has negative source X as screen-right. This establishes the mapping between the thumbnail and the measured floor plan.

To regenerate the browser assets from the original source:

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/export_model.py
```

Source SKP is unchanged. See `static/model/manifest.json` for source components and classification, and `README.md` for limitations.
