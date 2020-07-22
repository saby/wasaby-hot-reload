@Library('pipeline') _

def version = '20.5000'

node ('controls') {
    checkout_pipeline(env.BRANCH_NAME)
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('jenkins_pipeline', version)
}
