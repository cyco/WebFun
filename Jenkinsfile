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
                        sh 'ci=1 yarn test:unit'
                    }
                }

                stage("Run Acceptance Tests") {
                    steps {
                        sh 'ci=1 yarn test:acceptance'
                    }
                }

                stage("Run Performance Tests") {
                    steps {
                        sh 'ci=1 yarn test:performance'
                    }
                }
            }
		}

        stage("Collect metrics") {
            steps {
                def scannerHome = tool 'SonarQubeScanner3'
                withSonarQubeEnv('sonar') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
	}
}
