pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.CI'
            args  '--network=infrastructure_internal --link infrastructure_sonarqube_1:sonarqube'
        }
    }
	options { timestamps() }

	stages {
		stage("Install dependencies") {
            steps {
                sh 'yarn install --frozen-lockfile --non-interactive --offline'
            }
		}

		stage("Build") {
			steps {
				sh "ci=1 yarn build"
			}
		}

		stage("Test") {
            steps {
                sh 'ci=1 yarn test:full'
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
