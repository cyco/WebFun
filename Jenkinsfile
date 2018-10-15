pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.CI'
            args  '--network=webfunci_default --link webfunci_sonarqube_1:sonarqube'
        }
    }

	stages {
		stage("Install dependencies") {
            steps {
                sh 'yarn'
            }
		}

		stage("Build") {
			steps {
				sh "ci=1 yarn build"
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
                script {
                    def scannerHome = tool 'SonarQube Scanner';
                    withSonarQubeEnv('sonar') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
	}

    post {
        always {
            archiveArtifacts artifacts: 'build/*', fingerprint: true
        }
    }
}
