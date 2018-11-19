var rotateObj = 0;

function Base(){
	this.VertexPositionBuffer;
	this.VertexColorBuffer;
	this.VertexNormalBuffer;
	this.VertexTextureCoordinateBuffer;
	this.VertexIndexBuffer;
	this.vertices;
	this.colors;
	this.normals;
	this.textureCoordinates;
	this.vertexIndices;
	this.texture;
	
	this.name;
}

Base.prototype.draw = function(translate, scale, rotate){
	//rotateObj += 1;
	
	mvPushMatrix();

	// ZAENKRAT KAMERO PREMIKAMO SAMO V X,Z SMER
	//mat4.rotate(mvMatrix, degToRad(-cameraRotation[2]), [0, 0, 1]);
	//mat4.rotate(mvMatrix, degToRad(-cameraRotation[0]), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[0]), [0, 1, 0]); // LEVO-DESNO OBRAT

	mat4.translate(mvMatrix, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]]);

	translateX = objectPosition[0];
	translateY = objectPosition[1];
	translateZ = objectPosition[2];
	
	//mat4.translate(mvMatrix, translate); // dela
	//mat4.scale(mvMatrix, scale[0], scale[1], scale[2]);
	//mat4.translate(mvMatrix, [translateX,translateY,translateZ]); 
	mat4.translate(mvMatrix, objectPosition); 
	mat4.rotate(mvMatrix, degToRad(rotate[0]), [1, 0, 0]); 
	mat4.rotate(mvMatrix, degToRad(rotate[1]), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(rotate[2]), [0, 0, 1]);
	

		
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	  
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	
	// Set the texture coordinates attribute for the vertices.
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordinateBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.VertexTextureCoordinateBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Specify the texture to map onto the faces.
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	gl.uniform3fv(shaderProgram.lightPositionUniform, cameraPosition);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);

	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	mvPopMatrix();
}