pipeline {
    agent { dockerfile { filename 'Dockerfile.CI' } }
	stages {
		stage("Install dependencies") {
            steps {
                sh 'yarn'
            }
		}

		stage("Build") {
			steps {
				echo "Build program"
			}
		}

		stage("Test") {
            parallel {
                stage("Run Unit Tests") {
                    steps {
                        sh 'yarn test:unit'
                    }
                }

                stage("Run Acceptance Tests") {
                    steps {
                        sh 'yarn test:acceptance'
                    }
                }

                stage("Run Performance Tests") {
                    steps {
                        sh 'yarn test:performance'
                    }
                }
            }
		}
	}
}
