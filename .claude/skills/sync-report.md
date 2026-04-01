# sync-report

Regenerate `recommendations.html` after engine changes and show what shifted.

## Steps

1. Run the report generator from the project root:
   ```
   npx tsx generate-report.ts
   ```

2. Show what changed in the output file:
   ```
   git diff recommendations.html
   ```

3. Summarize the changes for the user:
   - Which TLD strings had score changes (application risk or competitive demand)
   - Any tier promotions or demotions (Tier 1/2/3 shifts)
   - Any new risk flags or removed flags
   - Net effect: did the portfolio get stronger or weaker overall?

Keep the summary short and focused on what moved. If nothing changed, say so.
