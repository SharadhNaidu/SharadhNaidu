<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SharadhNaidu/SharadhNaidu/main/assets/pulse-dark.svg">
  <img src="https://raw.githubusercontent.com/SharadhNaidu/SharadhNaidu/main/assets/pulse-light.svg" width="100%">
</picture>

# Sharadh Naidu

Machine learning engineer — I read model and library internals until they make sense, then fix what's actually broken upstream.

[iamsharadh7@gmail.com](mailto:iamsharadh7@gmail.com) · [LinkedIn](https://www.linkedin.com/in/sharadh-naidu-72259a32b/) · [X](https://x.com/SharadhNaidu) · [Hugging Face](https://huggingface.co/SharadhNaiduTrains) · [Kaggle](https://www.kaggle.com/iamsharadh7)

### <img src="https://raw.githubusercontent.com/SharadhNaidu/SharadhNaidu/main/assets/live-dot.svg" width="10" height="10"> Open-source fixes, synced live

Numerical edge cases in libraries a lot of people depend on. This list is pulled straight from the GitHub API on a schedule — not hand-edited, so it never drifts out of date.

<!--PR-STATUS:START-->
- **[matplotlib/matplotlib#31844](https://github.com/matplotlib/matplotlib/pull/31844)** — *merged*. Snap near-integer arc windings to a full circle on polar plots
- **[plotly/plotly.js#7837](https://github.com/plotly/plotly.js/pull/7837)** — *merged*. Fix `fitbounds` to pick the compact side of the globe across the antimeridian
- **[scipy/scipy#25355](https://github.com/scipy/scipy/pull/25355)** — *open*. `stats.linregress` now warns and returns NaN on constant input instead of garbage
- **[keras-team/keras#23093](https://github.com/keras-team/keras/pull/23093)** — *open*. Fix `ops.normalize` producing NaN gradients for zero vectors
- **[pandas-dev/pandas#65841](https://github.com/pandas-dev/pandas/pull/65841)** — *merged*. Fix `Categorical.map()` erroring when categories are mapped to tuples
<!--PR-STATUS:END-->

<sub>Last synced automatically — see <a href="https://github.com/SharadhNaidu/SharadhNaidu/actions/workflows/sync-readme.yml">sync-readme</a>.</sub>
