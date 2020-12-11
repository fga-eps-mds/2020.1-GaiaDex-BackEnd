from urllib.request import urlopen
import json

def metric_has_value(metric):
    for log in metric['history']:
        if 'value' in log:
            return True
    return False

def remove_non_numerical_values(df):
    print('\n')
    for column in df:
        print(column, end=', ')
        df[column] = pd.to_numeric(df[column].astype(str).str.replace(',',''), errors='coerce').fillna(0).astype(int)
    print('\n')
    return df                                     

# sonar ci not properly made in front yet
# repos = ['BackEnd', 'FrontEnd'] 
repo_url = f'https://sonarcloud.io/api/measures/search_history?component=fga-eps-mds_2020.1-GaiaDex-BackEnd&metrics=new_technical_debt,blocker_violations,bugs,classes,code_smells,cognitive_complexity,comment_lines,comment_lines_density,complexity_in_classes,complexity_in_functions,branch_coverage,new_branch_coverage,new_conditions_to_cover,confirmed_issues,coverage,new_coverage,complexity,development_cost,new_development_cost,duplicated_blocks,new_duplicated_blocks,duplicated_files,duplicated_lines,duplicated_lines_density,new_duplicated_lines_density,new_duplicated_lines,duplications_data,effort_to_reach_maintainability_rating_a,false_positive_issues,file_complexity_distribution,files,function_complexity_distribution,functions,generated_lines,generated_ncloc,info_violations,violations,line_coverage,new_line_coverage,ncloc,ncloc_language_distribution,lines_to_cover,new_lines_to_cover,sqale_rating,new_maintainability_rating,major_violations,minor_violations,new_blocker_violations,new_bugs,new_code_smells,new_critical_violations,new_info_violations,new_violations,new_lines,new_major_violations,new_minor_violations,new_security_hotspots,new_vulnerabilities,open_issues,quality_profiles,projects,public_api,public_documented_api_density,quality_gate_details,alert_status,reliability_rating,new_reliability_rating,reliability_remediation_effort,new_reliability_remediation_effort,reopened_issues,security_hotspots,security_hotspots_reviewed,new_security_hotspots_reviewed,security_rating,new_security_rating,security_remediation_effort,new_security_remediation_effort,security_review_rating,new_security_review_rating,security_hotspots_reviewed_status,new_security_hotspots_reviewed_status,security_hotspots_to_review_status,new_security_hotspots_to_review_status,skipped_tests,statements,sqale_index,sqale_debt_ratio,new_sqale_debt_ratio'

metrics = []

with urlopen(repo_url) as url:
    data = json.loads(url.read().decode())
    for metric in data['measures']:
        if metric_has_value(metric):
            metrics.append(metric)


import pandas as pd

df = pd.json_normalize(metrics, record_path='history', meta='metric')
df = df.pivot(index='date', columns='metric')
df.columns = df.columns.droplevel(0)
df = remove_non_numerical_values(df)
print(df)


from plotly.subplots import make_subplots
import plotly.graph_objects as go

plot_cols = 3
plot_rows = len(df.columns) // 3
fig = make_subplots(rows=plot_rows, cols=plot_cols, subplot_titles=tuple(df.columns[1:]))

x = 0
for i in range(1, plot_rows + 1):
    for j in range(1, plot_cols + 1):
        fig.add_trace(
            go.Scatter(
                x = df.index, 
                y = df[df.columns[x]].values,
                name = df.columns[x],
                mode = 'lines'
            ),
            row=i, col=j
        )
        x += 1

fig.update_layout(height=3200, width=1200)

import plotly.io as pio
pio.templates["custom_dark"] = pio.templates["plotly_dark"]
pio.templates["custom_dark"]['layout']['paper_bgcolor'] = '#2a2a29'
fig.layout.template = 'custom_dark'
pio.write_html(fig, file='dashboard/_includes/figure.html') #, auto_open=True)

# fig.show()
